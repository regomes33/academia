import React, { useState } from 'react';
import { Calendar, ChevronDown, TrendingUp, Dumbbell } from 'lucide-react';
import { getAllWorkouts, getExerciseHistory } from '../services/storageService';
import { getExerciseById, ALL_EXERCISES } from '../data/exercises';
import { DAY_NAMES, DAY_COLORS } from '../data/workoutPlans';
import { WorkoutSession, Exercise } from '../types';

const History: React.FC = () => {
    const [view, setView] = useState<'workouts' | 'exercises'>('workouts');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const workouts = getAllWorkouts().filter(w => w.completed).sort((a, b) => b.createdAt - a.createdAt);

    const renderWorkoutsList = () => {
        if (workouts.length === 0) {
            return (
                <div className="p-8 text-center">
                    <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Nenhum treino registrado</p>
                    <p className="text-gray-500 text-sm mt-2">Complete seu primeiro treino para ver o histórico aqui</p>
                </div>
            );
        }

        // Group workouts by month
        const grouped: Record<string, WorkoutSession[]> = {};
        workouts.forEach(workout => {
            const date = new Date(workout.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (!grouped[monthKey]) grouped[monthKey] = [];
            grouped[monthKey].push(workout);
        });

        return (
            <div className="space-y-6">
                {Object.entries(grouped).map(([monthKey, monthWorkouts]) => {
                    const [year, month] = monthKey.split('-');
                    const monthName = new Date(parseInt(year), parseInt(month)).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

                    return (
                        <section key={monthKey}>
                            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3 capitalize">
                                {monthName}
                            </h3>
                            <div className="space-y-2">
                                {monthWorkouts.map(workout => {
                                    const dayColor = DAY_COLORS[workout.dayType];
                                    const totalSets = workout.exercises.reduce((sum, ex) =>
                                        sum + ex.sets.filter(s => s.completed).length, 0
                                    );
                                    const totalVolume = workout.exercises.reduce((sum, ex) =>
                                        sum + ex.sets.reduce((setSum, s) => setSum + (s.weight * s.reps), 0), 0
                                    );

                                    return (
                                        <div
                                            key={workout.id}
                                            className="flex items-center justify-between p-4 bg-surface-dark rounded-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-sm ${dayColor.bg} flex flex-col items-center justify-center`}>
                                                    <span className={`text-lg font-bold ${dayColor.text}`}>
                                                        {new Date(workout.date).getDate()}
                                                    </span>
                                                    <span className={`text-[10px] ${dayColor.text} opacity-70`}>
                                                        {new Date(workout.date).toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold">{DAY_NAMES[workout.dayType]}</p>
                                                    <p className="text-gray-400 text-sm">
                                                        {workout.exercises.length} exercícios • {totalSets} séries
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-medium">
                                                    {totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume} kg
                                                </p>
                                                {workout.duration && (
                                                    <p className="text-gray-400 text-sm">{workout.duration} min</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>
        );
    };

    const renderExercisesList = () => {
        if (selectedExercise) {
            return renderExerciseDetail(selectedExercise);
        }

        return (
            <div className="space-y-2">
                {ALL_EXERCISES.map(exercise => {
                    const history = getExerciseHistory(exercise.id);
                    const lastLog = history[0];
                    const maxWeight = history.reduce((max, log) => {
                        const logMax = log.sets.reduce((setMax, set) => Math.max(setMax, set.weight), 0);
                        return Math.max(max, logMax);
                    }, 0);

                    const dayColor = DAY_COLORS[exercise.category];

                    return (
                        <button
                            key={exercise.id}
                            onClick={() => setSelectedExercise(exercise)}
                            className="w-full flex items-center justify-between p-4 bg-surface-dark rounded-sm hover:bg-surface-dark/80 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${dayColor.bg} flex items-center justify-center`}>
                                    <span className={`text-xs font-bold ${dayColor.text}`}>
                                        {DAY_NAMES[exercise.category].slice(0, 2)}
                                    </span>
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-medium">{exercise.name}</p>
                                    <p className="text-gray-400 text-sm">
                                        {history.length > 0 ? `${history.length} registros` : 'Sem registros'}
                                    </p>
                                </div>
                            </div>
                            {maxWeight > 0 && (
                                <div className="text-right">
                                    <p className="text-primary font-bold">{maxWeight} kg</p>
                                    <p className="text-gray-500 text-xs">PR</p>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderExerciseDetail = (exercise: Exercise) => {
        const history = getExerciseHistory(exercise.id);

        // Prepare chart data
        const chartData = history.slice(0, 10).reverse().map(log => {
            const maxWeight = log.sets.reduce((max, set) => Math.max(max, set.weight), 0);
            const totalReps = log.sets.reduce((sum, set) => sum + set.reps, 0);
            return { maxWeight, totalReps, timestamp: log.timestamp };
        });

        const maxChartWeight = Math.max(...chartData.map(d => d.maxWeight), 1);

        return (
            <div className="space-y-6">
                {/* Back button */}
                <button
                    onClick={() => setSelectedExercise(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronDown className="w-5 h-5 rotate-90" />
                    <span>Voltar</span>
                </button>

                {/* Exercise Header */}
                <div>
                    <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
                    <p className="text-gray-400">{exercise.description}</p>
                </div>

                {/* Progress Chart */}
                {chartData.length > 0 && (
                    <section className="p-4 bg-surface-dark rounded-sm">
                        <h3 className="text-gray-400 text-sm font-medium mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Progressão de Carga
                        </h3>
                        <div className="h-32 flex items-end gap-2">
                            {chartData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-primary/80 rounded-t transition-all"
                                        style={{ height: `${(data.maxWeight / maxChartWeight) * 100}%`, minHeight: '4px' }}
                                    />
                                    <span className="text-gray-500 text-[10px]">
                                        {new Date(data.timestamp).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* History List */}
                <section className="space-y-2">
                    <h3 className="text-gray-400 text-sm font-medium">Histórico Completo</h3>
                    {history.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Nenhum registro ainda</p>
                    ) : (
                        history.map((log, index) => {
                            const totalSets = log.sets.length;
                            const totalReps = log.sets.reduce((sum, s) => sum + s.reps, 0);
                            const maxWeight = log.sets.reduce((max, s) => Math.max(max, s.weight), 0);

                            return (
                                <div
                                    key={index}
                                    className="p-4 bg-surface-dark/50 rounded-sm"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-white font-medium">
                                            {new Date(log.timestamp).toLocaleDateString('pt-BR', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </p>
                                        <p className="text-primary font-bold">{maxWeight} kg</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {log.sets.map((set, setIndex) => (
                                            <span
                                                key={setIndex}
                                                className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300"
                                            >
                                                {set.weight}kg × {set.reps}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </section>
            </div>
        );
    };

    return (
        <div className="min-h-screen pb-24 px-4 pt-4">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-white">Histórico</h1>
                <p className="text-gray-400">Acompanhe sua evolução</p>
            </header>

            {/* View Toggle */}
            {!selectedExercise && (
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setView('workouts')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm font-medium transition-colors ${view === 'workouts'
                            ? 'bg-primary text-background-dark'
                            : 'bg-surface-dark text-gray-400 hover:text-white'
                            }`}
                    >
                        <Calendar className="w-5 h-5" />
                        Treinos
                    </button>
                    <button
                        onClick={() => setView('exercises')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm font-medium transition-colors ${view === 'exercises'
                            ? 'bg-primary text-background-dark'
                            : 'bg-surface-dark text-gray-400 hover:text-white'
                            }`}
                    >
                        <Dumbbell className="w-5 h-5" />
                        Exercícios
                    </button>
                </div>
            )}

            {/* Content */}
            {view === 'workouts' && !selectedExercise ? renderWorkoutsList() : renderExercisesList()}
        </div>
    );
};

export default History;
