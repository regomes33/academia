import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserSettings, WorkoutSession, DayType } from '../types';
import {
    getUserSettings,
    saveUserSettings,
    getCurrentSession,
    saveCurrentSession,
    saveWorkout,
    getRecentWorkouts,
    getWeeklySummary,
    generateId
} from '../services/storageService';
import { getPlanById, getTodayWorkout } from '../data/workoutPlans';
import { getExercisesByCategory } from '../data/exercises';

interface AppContextType {
    // Settings
    settings: UserSettings;
    updateSettings: (settings: Partial<UserSettings>) => void;

    // Current workout session
    currentSession: WorkoutSession | null;
    startWorkout: (dayType?: DayType) => void;
    endWorkout: (completed: boolean) => void;
    updateSession: (session: WorkoutSession) => void;

    // Navigation state
    selectedPlanId: string | null;
    setSelectedPlanId: (id: string | null) => void;

    // Rest timer
    restTimerActive: boolean;
    restTimeRemaining: number;
    startRestTimer: () => void;
    stopRestTimer: () => void;
    resetRestTimer: () => void;

    // Dark mode
    toggleDarkMode: () => void;

    // Data refresh
    refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<UserSettings>(getUserSettings);
    const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(getCurrentSession);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    // Rest timer state
    const [restTimerActive, setRestTimerActive] = useState(false);
    const [restTimeRemaining, setRestTimeRemaining] = useState(settings.restTimerDuration);

    // Apply dark mode on mount and when settings change
    useEffect(() => {
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings.darkMode]);

    // Rest timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (restTimerActive && restTimeRemaining > 0) {
            interval = setInterval(() => {
                setRestTimeRemaining(prev => {
                    if (prev <= 1) {
                        setRestTimerActive(false);
                        // Play notification sound
                        try {
                            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYaJi42PkZKUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4');
                            audio.play().catch(() => { });
                        } catch { }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [restTimerActive, restTimeRemaining]);

    const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
        const updated = saveUserSettings(newSettings);
        setSettings(updated);
        if (newSettings.restTimerDuration) {
            setRestTimeRemaining(newSettings.restTimerDuration);
        }
    }, []);

    const startWorkout = useCallback((dayType?: DayType) => {
        const planId = settings.selectedPlanId;
        const workoutDayType = dayType || (planId ? getTodayWorkout(planId) : 'push');

        if (workoutDayType === 'rest') {
            return; // Can't start a rest day workout
        }

        const exercises = getExercisesByCategory(workoutDayType);

        const session: WorkoutSession = {
            id: generateId(),
            date: new Date().toISOString().split('T')[0],
            planId: planId || 'custom',
            dayType: workoutDayType,
            exercises: exercises.map(ex => ({
                exerciseId: ex.id,
                sets: [],
                timestamp: Date.now()
            })),
            completed: false,
            createdAt: Date.now()
        };

        setCurrentSession(session);
        saveCurrentSession(session);
    }, [settings.selectedPlanId]);

    const endWorkout = useCallback((completed: boolean) => {
        if (currentSession) {
            const finishedSession: WorkoutSession = {
                ...currentSession,
                completed,
                completedAt: Date.now(),
                duration: Math.round((Date.now() - currentSession.createdAt) / 60000)
            };

            saveWorkout(finishedSession);
            setCurrentSession(null);
            saveCurrentSession(null);
        }
    }, [currentSession]);

    const updateSession = useCallback((session: WorkoutSession) => {
        setCurrentSession(session);
        saveCurrentSession(session);
    }, []);

    const startRestTimer = useCallback(() => {
        setRestTimeRemaining(settings.restTimerDuration);
        setRestTimerActive(true);
    }, [settings.restTimerDuration]);

    const stopRestTimer = useCallback(() => {
        setRestTimerActive(false);
    }, []);

    const resetRestTimer = useCallback(() => {
        setRestTimeRemaining(settings.restTimerDuration);
        setRestTimerActive(false);
    }, [settings.restTimerDuration]);

    const toggleDarkMode = useCallback(() => {
        updateSettings({ darkMode: !settings.darkMode });
    }, [settings.darkMode, updateSettings]);

    const refreshData = useCallback(() => {
        setSettings(getUserSettings());
        setCurrentSession(getCurrentSession());
    }, []);

    const value: AppContextType = {
        settings,
        updateSettings,
        currentSession,
        startWorkout,
        endWorkout,
        updateSession,
        selectedPlanId,
        setSelectedPlanId,
        restTimerActive,
        restTimeRemaining,
        startRestTimer,
        stopRestTimer,
        resetRestTimer,
        toggleDarkMode,
        refreshData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
