import { WorkoutSession, UserSettings, WeeklySummary, ExerciseLog } from '../types';

const STORAGE_KEYS = {
    WORKOUTS: 'ppl_workouts',
    SETTINGS: 'ppl_settings',
    CURRENT_SESSION: 'ppl_current_session'
};

// Default settings
const DEFAULT_SETTINGS: UserSettings = {
    selectedPlanId: null,
    restTimerDuration: 90,
    darkMode: true,
    userName: undefined
};

// ==================== USER SETTINGS ====================

export const getUserSettings = (): UserSettings => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.error('Error reading settings:', e);
    }
    return DEFAULT_SETTINGS;
};

export const saveUserSettings = (settings: Partial<UserSettings>): UserSettings => {
    const current = getUserSettings();
    const updated = { ...current, ...settings };
    try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {
        console.error('Error saving settings:', e);
    }
    return updated;
};

// ==================== WORKOUT SESSIONS ====================

export const getAllWorkouts = (): WorkoutSession[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error reading workouts:', e);
    }
    return [];
};

export const saveWorkout = (workout: WorkoutSession): void => {
    const workouts = getAllWorkouts();
    const existingIndex = workouts.findIndex(w => w.id === workout.id);

    if (existingIndex >= 0) {
        workouts[existingIndex] = workout;
    } else {
        workouts.push(workout);
    }

    try {
        localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    } catch (e) {
        console.error('Error saving workout:', e);
    }
};

export const getWorkoutById = (id: string): WorkoutSession | undefined => {
    return getAllWorkouts().find(w => w.id === id);
};

export const deleteWorkout = (id: string): void => {
    const workouts = getAllWorkouts().filter(w => w.id !== id);
    try {
        localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    } catch (e) {
        console.error('Error deleting workout:', e);
    }
};

// ==================== CURRENT SESSION ====================

export const getCurrentSession = (): WorkoutSession | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error reading current session:', e);
    }
    return null;
};

export const saveCurrentSession = (session: WorkoutSession | null): void => {
    try {
        if (session) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
        } else {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
        }
    } catch (e) {
        console.error('Error saving current session:', e);
    }
};

// ==================== HISTORY & STATS ====================

export const getRecentWorkouts = (limit: number = 5): WorkoutSession[] => {
    return getAllWorkouts()
        .filter(w => w.completed)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);
};

export const getWeeklySummary = (): WeeklySummary => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);

    const weekWorkouts = getAllWorkouts().filter(w => {
        const workoutDate = new Date(w.date);
        return w.completed && workoutDate >= startOfWeek;
    });

    let totalSets = 0;
    let totalReps = 0;
    let totalVolume = 0;

    weekWorkouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
                if (set.completed) {
                    totalSets++;
                    totalReps += set.reps;
                    totalVolume += set.weight * set.reps;
                }
            });
        });
    });

    return {
        weekStart: startOfWeek.toISOString().split('T')[0],
        daysTrainedCount: weekWorkouts.length,
        totalSets,
        totalReps,
        totalVolume,
        workoutIds: weekWorkouts.map(w => w.id)
    };
};

export const getExerciseHistory = (exerciseId: string): ExerciseLog[] => {
    const allWorkouts = getAllWorkouts().filter(w => w.completed);
    const logs: ExerciseLog[] = [];

    allWorkouts.forEach(workout => {
        const exerciseLog = workout.exercises.find(e => e.exerciseId === exerciseId);
        if (exerciseLog) {
            logs.push(exerciseLog);
        }
    });

    return logs.sort((a, b) => b.timestamp - a.timestamp);
};

export const getLastExerciseLog = (exerciseId: string): ExerciseLog | undefined => {
    const history = getExerciseHistory(exerciseId);
    return history[0];
};

// ==================== UTILITIES ====================

export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const clearAllData = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.WORKOUTS);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    } catch (e) {
        console.error('Error clearing data:', e);
    }
};

export const exportData = (): string => {
    const data = {
        workouts: getAllWorkouts(),
        settings: getUserSettings(),
        exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
};
