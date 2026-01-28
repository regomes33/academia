import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, Copy, Check, Plus, Flame, Clock, Target, ChevronDown, ChevronUp, Timer, Route, Repeat } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getExerciseById, ALL_EXERCISES } from '../data/exercises';
import { DAY_NAMES, DAY_DESCRIPTIONS } from '../data/workoutPlans';
import { getLastExerciseLog } from '../services/storageService';
import { ExerciseLog, SetLog, ExerciseInputType, Exercise } from '../types';

interface WorkoutProps {
    onBack: () => void;
    onFinish: () => void;
}

const Workout: React.FC<WorkoutProps> = ({ onBack, onFinish }) => {
    const { currentSession, updateSession, settings } = useApp();
    const [elapsedTime, setElapsedTime] = useState(0);
    const [expandedExercise, setExpandedExercise] = useState<number | null>(0);
    const [showFinishConfirm, setShowFinishConfirm] = useState(false);

    // Timer effect with requestAnimationFrame for better performance
    useEffect(() => {
        if (!currentSession) return;

        const startTime = currentSession.createdAt;
        let animationFrame: number;

        const updateTimer = () => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            animationFrame = requestAnimationFrame(updateTimer);
        };

        // Update every second instead of every frame
        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => {
            clearInterval(interval);
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [currentSession]);

    // Calculate workout progress
    const progress = useMemo(() => {
        if (!currentSession) return { completed: 0, total: 0, percentage: 0 };

        let completed = 0;
        let total = 0;

        currentSession.exercises.forEach(ex => {
            ex.sets.forEach(set => {
                total++;
                if (set.completed) completed++;
            });
        });

        return {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }, [currentSession]);

    const formatTime = useCallback((seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    if (!currentSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-sm bg-surface-dark flex items-center justify-center">
                        <Target className="w-8 h-8 text-text-tertiary" />
                    </div>
                    <p className="text-text-secondary">Nenhum treino ativo</p>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-primary text-black font-medium rounded-sm hover-scale"
                    >
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        );
    }

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

    const handleUpdateSet = (
        exerciseIndex: number,
        setIndex: number,
        field: 'weight' | 'reps' | 'distance' | 'time',
        value: number
    ) => {
        const updatedExercises = [...currentSession.exercises];
        updatedExercises[exerciseIndex].sets[setIndex] = {
            ...updatedExercises[exerciseIndex].sets[setIndex],
            [field]: Math.max(0, value)
        };
        updateSession({ ...currentSession, exercises: updatedExercises });
    };

    // Format time input for display (seconds to mm:ss)
    const formatTimeInput = (seconds: number): string => {
        if (!seconds) return '';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Parse time input (mm:ss or just seconds)
    const parseTimeInput = (value: string): number => {
        if (value.includes(':')) {
            const [mins, secs] = value.split(':').map(Number);
            return (mins || 0) * 60 + (secs || 0);
        }
        return parseInt(value) || 0;
    };

    // Get labels based on input type
    const getInputLabels = (inputType: ExerciseInputType = 'weight_reps') => {
        switch (inputType) {
            case 'distance_time':
                return { first: 'Km', second: 'Tempo' };
            case 'reps_only':
                return { first: 'Reps', second: null };
            case 'time_only':
                return { first: 'Tempo', second: null };
            case 'time_reps':
                return { first: 'Tempo', second: 'Reps' };
            default:
                return { first: 'Kg', second: 'Reps' };
        }
    };

    const handleToggleSet = (exerciseIndex: number, setIndex: number) => {
        const updatedExercises = [...currentSession.exercises];
        const wasCompleted = updatedExercises[exerciseIndex].sets[setIndex].completed;
        updatedExercises[exerciseIndex].sets[setIndex].completed = !wasCompleted;
        updateSession({ ...currentSession, exercises: updatedExercises });

        // Visual feedback - add celebration animation when completing
        if (!wasCompleted) {
            const button = document.querySelector(`[data-set="${exerciseIndex}-${setIndex}"]`);
            button?.classList.add('animate-bounce');
            setTimeout(() => button?.classList.remove('animate-bounce'), 600);
        }
    };

    const handleFinishWorkout = () => {
        if (progress.completed < progress.total) {
            setShowFinishConfirm(true);
        } else {
            onFinish();
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-background-dark">
            {/* Sticky Header with Progress */}
            <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur border-b border-white/5">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="flex size-10 items-center justify-center rounded-sm hover:bg-white/10 transition-colors interactive"
                            aria-label="Voltar"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>

                        <div className="flex flex-col items-center">
                            <h1 className="text-lg font-bold text-white">
                                {DAY_NAMES[currentSession.dayType]}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(elapsedTime)}</span>
                                <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                                <span>{progress.completed}/{progress.total} séries</span>
                            </div>
                        </div>

                        <button
                            onClick={handleFinishWorkout}
                            className="flex h-9 px-4 items-center justify-center rounded-sm bg-primary text-black font-bold text-sm hover-scale hover:shadow-glow-primary-sm transition-all"
                        >
                            Finalizar
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-surface-dark">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${progress.percentage}%` }}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col gap-4 p-4 stagger-children">
                {/* Copy Last Workout Button */}
                <button
                    onClick={handleCopyLastWorkout}
                    className="group relative w-full overflow-hidden rounded-sm bg-surface-dark border border-white/5 p-4 hover-lift active:scale-[0.98] transition-all"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <div className="relative flex items-center justify-center gap-3">
                        <Copy className="w-5 h-5 text-primary" />
                        <span className="text-sm font-bold text-white">Copiar último treino</span>
                    </div>
                </button>

                {/* Exercise Cards */}
                {currentSession.exercises.map((exerciseLog, exerciseIndex) => {
                    const exercise = getExerciseById(exerciseLog.exerciseId);
                    if (!exercise) return null;

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

                    const completedSets = exerciseLog.sets.filter(s => s.completed).length;
                    const isExpanded = expandedExercise === exerciseIndex;
                    const isComplete = completedSets === exerciseLog.sets.length;

                    return (
                        <div
                            key={exercise.id}
                            className={`flex flex-col rounded-sm bg-surface-dark border transition-all duration-250 ${isComplete ? 'border-primary/30' : 'border-white/5'}`}
                        >
                            {/* Exercise Header - Collapsible */}
                            <button
                                onClick={() => setExpandedExercise(isExpanded ? null : exerciseIndex)}
                                className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${isComplete ? 'bg-primary/20' : 'bg-white/5'}`}>
                                        {isComplete ? (
                                            <Check className="w-6 h-6 text-primary" />
                                        ) : (
                                            <Flame className="w-6 h-6 text-text-tertiary" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base font-bold text-white">{exercise.name}</h3>
                                        <p className="text-xs text-text-secondary">
                                            {completedSets}/{exerciseLog.sets.length} séries • {exercise.muscleGroups[0]}
                                        </p>
                                    </div>
                                </div>
                                {isExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-text-tertiary" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-text-tertiary" />
                                )}
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && (() => {
                                const inputType = exercise.inputType || 'weight_reps';
                                const labels = getInputLabels(inputType);
                                const hasTwoInputs = labels.second !== null;
                                const gridCols = hasTwoInputs
                                    ? 'grid-cols-[40px_1fr_1fr_48px]'
                                    : 'grid-cols-[40px_1fr_48px]';

                                return (
                                    <div className="px-4 pb-4 space-y-3 animate-fade-in">
                                        {/* Labels Row */}
                                        <div className={`grid ${gridCols} gap-2 px-1`}>
                                            <span className="text-center text-xs font-bold text-text-tertiary uppercase">Set</span>
                                            <span className="text-center text-xs font-bold text-text-tertiary uppercase">{labels.first}</span>
                                            {hasTwoInputs && (
                                                <span className="text-center text-xs font-bold text-text-tertiary uppercase">{labels.second}</span>
                                            )}
                                            <span className="text-center text-xs font-bold text-text-tertiary uppercase"></span>
                                        </div>

                                        {/* Set Rows */}
                                        {exerciseLog.sets.map((set, setIndex) => {
                                            const isCompleted = set.completed;
                                            const isActive = !isCompleted && setIndex === exerciseLog.sets.findIndex(s => !s.completed);

                                            // Render first input based on type
                                            const renderFirstInput = () => {
                                                switch (inputType) {
                                                    case 'distance_time':
                                                        return (
                                                            <input
                                                                type="number"
                                                                inputMode="decimal"
                                                                step="0.1"
                                                                value={set.distance || ''}
                                                                onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'distance', parseFloat(e.target.value) || 0)}
                                                                className={`h-10 w-full rounded-sm border-0 bg-background-dark text-center text-white font-bold ring-1 focus:ring-2 focus:ring-primary placeholder:font-normal placeholder:text-text-tertiary ${isActive ? 'ring-primary/50' : 'ring-white/10'}`}
                                                                placeholder="0.0"
                                                                disabled={isCompleted}
                                                            />
                                                        );
                                                    case 'reps_only':
                                                        return (
                                                            <input
                                                                type="number"
                                                                inputMode="numeric"
                                                                value={set.reps || ''}
                                                                onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                                                                className={`h-10 w-full rounded-sm border-0 bg-background-dark text-center text-white font-bold ring-1 focus:ring-2 focus:ring-primary placeholder:font-normal placeholder:text-text-tertiary ${isActive ? 'ring-primary/50' : 'ring-white/10'}`}
                                                                placeholder="0"
                                                                disabled={isCompleted}
                                                            />
                                                        );
                                                    case 'time_only':
                                                    case 'time_reps':
                                                        return (
                                                            <input
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={set.time ? formatTimeInput(set.time) : ''}
                                                                onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'time', parseTimeInput(e.target.value))}
                                                                className={`h-10 w-full rounded-sm border-0 bg-background-dark text-center text-white font-bold ring-1 focus:ring-2 focus:ring-primary placeholder:font-normal placeholder:text-text-tertiary ${isActive ? 'ring-primary/50' : 'ring-white/10'}`}
                                                                placeholder="0:00"
                                                                disabled={isCompleted}
                                                            />
                                                        );
                                                    default: // weight_reps
                                                        return (
                                                            <input
                                                                type="number"
                                                                inputMode="decimal"
                                                                value={set.weight || ''}
                                                                onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                                                                className={`h-10 w-full rounded-sm border-0 bg-background-dark text-center text-white font-bold ring-1 focus:ring-2 focus:ring-primary placeholder:font-normal placeholder:text-text-tertiary ${isActive ? 'ring-primary/50' : 'ring-white/10'}`}
                                                                placeholder="0"
                                                                disabled={isCompleted}
                                                            />
                                                        );
                                                }
                                            };

                                            // Render second input based on type
                                            const renderSecondInput = () => {
                                                switch (inputType) {
                                                    case 'distance_time':
                                                        return (
                                                            <input
                                                                type="text"
                                                                inputMode="numeric"
                                                                value={set.time ? formatTimeInput(set.time) : ''}
                                                                onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'time', parseTimeInput(e.target.value))}
                                                                className={`h-10 w-full rounded-sm border-0 bg-background-dark text-center text-white font-bold ring-1 focus:ring-2 focus:ring-primary placeholder:font-normal placeholder:text-text-tertiary ${isActive ? 'ring-primary/50' : 'ring-white/10'}`}
                                                                placeholder="0:00"
                                                                disabled={isCompleted}
                                                            />
                                                        );
                                                    case 'time_reps':
                                                        return (
                                                            <input
                                                                type="number"
                                                                inputMode="numeric"
                                                                value={set.reps || ''}
                                                                onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                                                                className={`h-10 w-full rounded-sm border-0 bg-background-dark text-center text-white font-bold ring-1 focus:ring-2 focus:ring-primary placeholder:font-normal placeholder:text-text-tertiary ${isActive ? 'ring-primary/50' : 'ring-white/10'}`}
                                                                placeholder="0"
                                                                disabled={isCompleted}
                                                            />
                                                        );
                                                    case 'weight_reps':
                                                    default:
                                                        return (
                                                            <input
                                                                type="number"
                                                                inputMode="numeric"
                                                                value={set.reps || ''}
                                                                onChange={(e) => handleUpdateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                                                                className={`h-10 w-full rounded-sm border-0 bg-background-dark text-center text-white font-bold ring-1 focus:ring-2 focus:ring-primary placeholder:font-normal placeholder:text-text-tertiary ${isActive ? 'ring-primary/50' : 'ring-white/10'}`}
                                                                placeholder="0"
                                                                disabled={isCompleted}
                                                            />
                                                        );
                                                }
                                            };

                                            return (
                                                <div
                                                    key={setIndex}
                                                    className={`grid ${gridCols} gap-2 items-center transition-opacity ${!isCompleted && !isActive ? 'opacity-50' : ''}`}
                                                >
                                                    {/* Set Number */}
                                                    <div className={`flex h-10 items-center justify-center rounded-sm text-sm font-bold ${isActive
                                                        ? 'bg-primary/20 text-primary'
                                                        : isCompleted
                                                            ? 'bg-primary/10 text-primary/70'
                                                            : 'bg-white/5 text-text-tertiary'
                                                        }`}>
                                                        {set.setNumber}
                                                    </div>

                                                    {/* First Input */}
                                                    {renderFirstInput()}

                                                    {/* Second Input (if applicable) */}
                                                    {hasTwoInputs && renderSecondInput()}

                                                    {/* Complete Button */}
                                                    <button
                                                        data-set={`${exerciseIndex}-${setIndex}`}
                                                        onClick={() => handleToggleSet(exerciseIndex, setIndex)}
                                                        className={`flex size-10 items-center justify-center rounded-sm transition-all duration-250 ${isCompleted
                                                            ? 'bg-primary text-black shadow-glow-primary-sm'
                                                            : 'bg-white/10 text-text-tertiary hover:bg-white/20 hover:text-white'
                                                            }`}
                                                        aria-label={isCompleted ? "Desmarcar série" : "Completar série"}
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        {/* Add Set Button */}
                                        <button
                                            onClick={() => handleAddSet(exerciseIndex)}
                                            className="flex w-full items-center justify-center gap-2 py-2 rounded-sm text-sm font-medium text-primary hover:bg-primary/5 transition-colors interactive"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Adicionar série
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    );
                })}
            </main>

            {/* Finish Confirmation Modal */}
            {showFinishConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
                    <div className="w-full max-w-sm bg-surface-dark rounded-sm p-6 space-y-4 animate-scale-in">
                        <h2 className="text-xl font-bold text-white">Finalizar treino?</h2>
                        <p className="text-text-secondary">
                            Você completou {progress.completed} de {progress.total} séries ({progress.percentage}%).
                            Tem certeza que deseja finalizar?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFinishConfirm(false)}
                                className="flex-1 py-3 bg-white/10 text-white font-medium rounded-sm hover:bg-white/20 transition-colors"
                            >
                                Continuar
                            </button>
                            <button
                                onClick={onFinish}
                                className="flex-1 py-3 bg-primary text-black font-bold rounded-sm hover-scale"
                            >
                                Finalizar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workout;
