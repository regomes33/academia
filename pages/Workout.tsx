import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getExerciseById, ALL_EXERCISES } from '../data/exercises';
import { DAY_NAMES, DAY_DESCRIPTIONS } from '../data/workoutPlans';
import { getLastExerciseLog } from '../services/storageService';
import { ExerciseLog, SetLog } from '../types';

// Exercise images mapping
const EXERCISE_IMAGES: Record<string, string> = {
    'barra-fixa': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDacu7pK-y1HVN5jsTIDlGby8kVZ6VphpctBv1aUkzrabVhCjJZA7tT7AAZcQ_m6AjdkPVIXYiuxEvwygs0d6QyNVCL5niIRWkmIPJMUXMqsk6TOPWpzu_1_DlMgsnu2G7p2THnkkjnTZBOPUWFO93EBqBJfz2y8M-1AkRV9Lw65CIi_6MRAfhl5pvRLeK5hEVUYrNsewyggCixpKpOiQ8jO3-cHmtT2gANXS6VjbVUsJ0slQy0LssYOFIXHecnir1_fX0-pjWl_dH2',
    'puxada-frontal': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT-jUvreZfXTVqIBZYD0yGdPoPQWGsuN48p2KjNIMdUauU0HExSMbQvK5YsZo4QbOTyUR2uV5WsHOY7n-tqueHu4Yhv5QjzQM4gx4Pxmamzo5M9ZHAeEUKpV-ZzyiPyxprvLNjFfWGjHLo7x6oAMpX5QEspQMcrU2d5maaAJSEnLzwQUOk0SWDv0eBbVWbIpL_MP_CkEDsc46a-33DTyLpztOa29vdUrzTnZnrHZQ69xqgN9J6RjJhfi7yl5v3DVM2HLr_ijSorT9z',
    'rosca-direta': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG3sRyJJOLx4w5TyvUT3CD4SLHgdSrEIWIISWoGi6V5lRKXweIxmawX_V25X6BRFXQzRxobMNTmEUmTWFAioRCzuv24lpi_LbJijQaaZwQUXgJj2hqd1s5hayXsN2HEX6LElA4DH6AKUJmkGM-hx-b86mnKYVTNRD1kLlEF03OjqsjIgpc-xxsHQ4YRmcTDMJMQrMO_6g2G0jxfbsvq6UIKGYTVtfFgW0-uL_TYWbJmy7ROyCnjnlegVB2q_1wjBASDLCqgJClRYYb',
    'supino-reto': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCETbx-7B2cTDAZeFfnPJw8y4vB_Ff0uxKE-0PKsMSfvyR0SLp6CMS6e23B5uINulrnRaG89j4JHsUcAROeBvMwZLo5N5wZJVspmWbObmrRbi-GbyBxP4_kCtV_IBgAPrO8zMxgDpNpMueSSkmmzOni4IjtBs1tVDwifl_ZLL6tDwDknVrUUQqLul2kxgevaIjO_QcS9wP_AByirrNLiTvLaBCynntNev1iEZg5kMkBftUhuKurNeJI6aYPEwJDrv5rcGPSNrY3dLXS',
    'agachamento': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsMLVYPaPqd4EWdXL2MF5qpjOUyep922UvONdVGnxG5SQwCJFh8szhMy1IogvEwq43p5RkTBlQ3jpvkL_cZkoJs6umNtNXAxjbnItOkSEm6N119Ylc9pmNDNBRWDh1tgiualDjeg8FlMwQ2yBiSCPFuGcM9zxrIIOy3n5GcZ_2KeBo14AlguYIm9dtL2i699JQGSaItdKN01G-Fd7EAn_zSu_EFkh0MsUBWd40BUtsfzwzDoLdoDjTowwFYkbGR52aaZgN_kMCroNU',
};

interface WorkoutProps {
    onBack: () => void;
    onFinish: () => void;
}

const Workout: React.FC<WorkoutProps> = ({ onBack, onFinish }) => {
    const { currentSession, updateSession, settings } = useApp();
    const [elapsedTime, setElapsedTime] = useState(0);

    // Timer effect
    useEffect(() => {
        if (!currentSession) return;

        const startTime = currentSession.createdAt;
        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [currentSession]);

    if (!currentSession) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Nenhum treino ativo</p>
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCopyLastWorkout = () => {
        const updatedExercises = currentSession.exercises.map(exerciseLog => {
            const lastLog = getLastExerciseLog(exerciseLog.exerciseId);
            if (lastLog && lastLog.sets.length > 0) {
                return {
                    ...exerciseLog,
                    sets: lastLog.sets.map((set, idx) => ({
                        ...set,
                        setNumber: idx + 1,
                        completed: false
                    }))
                };
            }
            return exerciseLog;
        });

        updateSession({
            ...currentSession,
            exercises: updatedExercises
        });
    };

    const handleAddSet = (exerciseIndex: number) => {
        const updatedExercises = [...currentSession.exercises];
        const exercise = updatedExercises[exerciseIndex];
        const lastSet = exercise.sets[exercise.sets.length - 1];

        exercise.sets.push({
            setNumber: exercise.sets.length + 1,
            weight: lastSet?.weight || 0,
            reps: lastSet?.reps || 10,
            completed: false
        });

        updateSession({ ...currentSession, exercises: updatedExercises });
    };

    const handleUpdateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: number) => {
        const updatedExercises = [...currentSession.exercises];
        updatedExercises[exerciseIndex].sets[setIndex] = {
            ...updatedExercises[exerciseIndex].sets[setIndex],
            [field]: Math.max(0, value)
        };
        updateSession({ ...currentSession, exercises: updatedExercises });
    };

    const handleToggleSet = (exerciseIndex: number, setIndex: number) => {
        const updatedExercises = [...currentSession.exercises];
        updatedExercises[exerciseIndex].sets[setIndex].completed =
            !updatedExercises[exerciseIndex].sets[setIndex].completed;
        updateSession({ ...currentSession, exercises: updatedExercises });
    };

    const handleFinishWorkout = () => {
        onFinish();
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-background-dark">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-sm border-b border-white/10 px-4 py-3">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>arrow_back</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-lg font-bold leading-tight tracking-tight text-white">
                            Treino {DAY_NAMES[currentSession.dayType]}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                            <p className="text-xs font-medium text-gray-400">
                                {DAY_DESCRIPTIONS[currentSession.dayType]} • {formatTime(elapsedTime)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleFinishWorkout}
                        className="flex h-9 px-3 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        <span className="text-sm font-bold">Finalizar</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col gap-6 p-4">
                {/* Copy Last Workout Button */}
                <button
                    onClick={handleCopyLastWorkout}
                    className="group relative w-full overflow-hidden rounded-xl bg-surface-dark border border-white/5 p-4 shadow-lg active:scale-[0.98] transition-all duration-200"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="relative flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-primary">content_copy</span>
                        <span className="text-sm font-bold text-white">Copiar último treino</span>
                    </div>
                </button>

                {/* Exercise Cards */}
                {currentSession.exercises.map((exerciseLog, exerciseIndex) => {
                    const exercise = getExerciseById(exerciseLog.exerciseId);
                    if (!exercise) return null;

                    const imageUrl = EXERCISE_IMAGES[exercise.id];
                    const defaultSets = exerciseLog.sets.length === 0 ? 3 : 0;

                    // Auto-add default sets if empty
                    if (exerciseLog.sets.length === 0) {
                        const newSets: SetLog[] = Array.from({ length: 3 }, (_, i) => ({
                            setNumber: i + 1,
                            weight: 0,
                            reps: 0,
                            completed: false
                        }));
                        exerciseLog.sets = newSets;
                    }

                    return (
                        <div
                            key={exercise.id}
                            className="flex flex-col gap-4 rounded-xl bg-surface-dark border border-white/5 p-4 shadow-md"
                        >
                            {/* Exercise Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    {imageUrl ? (
                                        <div
                                            className="size-16 rounded-lg bg-center bg-cover bg-no-repeat bg-gray-800"
                                            style={{ backgroundImage: `url('${imageUrl}')` }}
                                        />
                                    ) : (
                                        <div className="flex size-16 items-center justify-center rounded-lg bg-white/5 text-gray-500">
                                            <span className="material-symbols-outlined text-3xl">fitness_center</span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
                                        <p className="text-sm text-gray-400">
                                            {exercise.muscleGroups.join(', ')} • {exerciseLog.sets.length} séries
                                        </p>
                                    </div>
                                </div>
                                <button className="text-primary hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">history</span>
                                </button>
                            </div>

                            {/* Labels Row */}
                            <div className="grid grid-cols-[32px_1fr_1fr_40px] gap-3 px-1">
                                <span className="text-center text-xs font-bold text-gray-500 uppercase">Set</span>
                                <span className="text-center text-xs font-bold text-gray-500 uppercase">Kg</span>
                                <span className="text-center text-xs font-bold text-gray-500 uppercase">Reps</span>
                                <span className="text-center text-xs font-bold text-gray-500 uppercase"></span>
                            </div>

                            {/* Set Rows */}
                            <div className="flex flex-col gap-3">
                                {exerciseLog.sets.map((set, setIndex) => {
                                    const isCompleted = set.completed;
                                    const isActive = !isCompleted && setIndex === exerciseLog.sets.findIndex(s => !s.completed);

                                    return (
                                        <div
                                            key={setIndex}
                                            className={`grid grid-cols-[32px_1fr_1fr_40px] gap-3 items-center ${!isCompleted && !isActive ? 'opacity-60 hover:opacity-100 transition-opacity' : ''
                                                }`}
                                        >
                                            {/* Set Number */}
                                            <div className={`flex h-8 items-center justify-center rounded text-sm font-bold ${isActive
                                                    ? 'bg-primary/20 text-primary'
                                                    : 'bg-white/5 text-gray-400'
                                                }`}>
                                                {set.setNumber}
                                            </div>

                                            {/* Weight Input */}
                                            <input
                                                type="number"
                                                value={set.weight || ''}
                                                onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                                                className={`h-10 w-full rounded-lg border-0 bg-background-dark text-center text-white font-bold ring-1 focus:ring-primary focus:bg-background-dark/80 placeholder:font-normal placeholder:text-gray-600 ${isActive ? 'ring-primary' : 'ring-white/10'
                                                    }`}
                                                placeholder="kg"
                                            />

                                            {/* Reps Input */}
                                            <input
                                                type="number"
                                                value={set.reps || ''}
                                                onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                                                className={`h-10 w-full rounded-lg border-0 bg-background-dark text-center text-white font-bold ring-1 focus:ring-primary focus:bg-background-dark/80 placeholder:font-normal placeholder:text-gray-600 ${isActive ? 'ring-primary' : 'ring-white/10'
                                                    }`}
                                                placeholder="reps"
                                            />

                                            {/* Complete Button */}
                                            <button
                                                onClick={() => handleToggleSet(exerciseIndex, setIndex)}
                                                className={`flex size-10 items-center justify-center rounded-lg transition-all ${isCompleted
                                                        ? 'bg-primary text-background-dark shadow-[0_0_10px_rgba(19,236,19,0.4)]'
                                                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined font-bold">check</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Add Set Button */}
                            <button
                                onClick={() => handleAddSet(exerciseIndex)}
                                className="mt-2 flex w-full items-center justify-center rounded-lg py-2 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                            >
                                + Adicionar série
                            </button>
                        </div>
                    );
                })}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-start justify-around border-t border-white/5 bg-background-dark/95 backdrop-blur-md pt-4">
                <button
                    onClick={onBack}
                    className="group flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl group-hover:-translate-y-0.5 transition-transform">home</span>
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button className="group flex flex-col items-center gap-1 text-primary">
                    <div className="flex size-10 -translate-y-4 items-center justify-center rounded-full bg-primary text-background-dark shadow-[0_0_15px_rgba(19,236,19,0.5)]">
                        <span className="material-symbols-outlined text-2xl font-bold">fitness_center</span>
                    </div>
                    <span className="text-[10px] font-bold">Treinar</span>
                </button>
                <button className="group flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl group-hover:-translate-y-0.5 transition-transform">person</span>
                    <span className="text-[10px] font-medium">Perfil</span>
                </button>
            </nav>
        </div>
    );
};

export default Workout;
