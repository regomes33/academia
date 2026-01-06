import React from 'react';
import { Play, Calendar, Flame, TrendingUp, ChevronRight, Dumbbell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRecentWorkouts, getWeeklySummary } from '../services/storageService';
import { DAY_NAMES, DAY_COLORS, getPlanById } from '../data/workoutPlans';
import { DayType } from '../types';

interface DashboardProps {
    onStartWorkout: (dayType: DayType) => void;
    onSelectPlan: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartWorkout, onSelectPlan }) => {
    const { settings, currentSession } = useApp();
    const recentWorkouts = getRecentWorkouts(5);
    const weeklySummary = getWeeklySummary();
    const selectedPlan = settings.selectedPlanId ? getPlanById(settings.selectedPlanId) : null;

    // Get next workout day type
    const getNextWorkoutDay = (): DayType => {
        if (!selectedPlan) return 'push';
        const dayOfWeek = new Date().getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        return selectedPlan.schedule[adjustedDay] || 'push';
    };

    const nextWorkoutDay = getNextWorkoutDay();
    const isRestDay = nextWorkoutDay === 'rest';

    return (
        <div className="flex flex-col gap-6 pb-24">
            {/* Welcome Section */}
            <section className="space-y-1">
                <p className="text-gray-400 text-sm">Bem-vindo de volta</p>
                <h1 className="text-2xl font-bold text-white">
                    {settings.userName || 'Atleta'} 💪
                </h1>
            </section>

            {/* Plan Selection or Current Plan */}
            {!selectedPlan ? (
                <button
                    onClick={onSelectPlan}
                    className="flex items-center justify-between p-4 bg-surface-dark rounded-xl border border-primary/30 hover:border-primary/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <Dumbbell className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-semibold">Escolha seu plano</p>
                            <p className="text-gray-400 text-sm">Selecione uma rotina PPL</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
            ) : (
                <div className="p-4 bg-surface-dark rounded-xl border border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Plano Atual</p>
                            <p className="text-white font-semibold mt-1">{selectedPlan.title}</p>
                            <p className="text-gray-400 text-sm">{selectedPlan.daysPerWeek} dias/semana</p>
                        </div>
                        <button
                            onClick={onSelectPlan}
                            className="text-primary text-sm font-medium hover:underline"
                        >
                            Alterar
                        </button>
                    </div>
                </div>
            )}


            {/* Workout Type Selection */}
            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Escolha seu Treino</h2>
                <div className="grid grid-cols-1 gap-3">
                    {/* Push Button */}
                    <button
                        onClick={() => onStartWorkout('push')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-300 ${currentSession
                            ? 'bg-gray-800 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-600/80 to-red-500/80 hover:from-red-600 hover:to-red-500 shadow-lg shadow-red-500/25 active:scale-[0.98]'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-300">
                                        PUSH
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-white'}`}>
                                    Peito, Ombros, Tríceps
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-white/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-white'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>

                    {/* Pull Button */}
                    <button
                        onClick={() => onStartWorkout('pull')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-300 ${currentSession
                            ? 'bg-gray-800 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-600 hover:to-blue-500 shadow-lg shadow-blue-500/25 active:scale-[0.98]'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300">
                                        PULL
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-white'}`}>
                                    Costas, Bíceps
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-white/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-white'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>

                    {/* Legs Button */}
                    <button
                        onClick={() => onStartWorkout('legs')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-300 ${currentSession
                            ? 'bg-gray-800 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600/80 to-green-500/80 hover:from-green-600 hover:to-green-500 shadow-lg shadow-green-500/25 active:scale-[0.98]'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-300">
                                        LEGS
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-white'}`}>
                                    Pernas
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-white/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-white'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>

                    {/* Upper Body Button */}
                    <button
                        onClick={() => onStartWorkout('upper')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-300 ${currentSession
                                ? 'bg-gray-800 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-600 hover:to-purple-500 shadow-lg shadow-purple-500/25 active:scale-[0.98]'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300">
                                        UPPER
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-white'}`}>
                                    Superiores Completo
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-white/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-white'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>

                    {/* Lower Body Button */}
                    <button
                        onClick={() => onStartWorkout('lower')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-300 ${currentSession
                                ? 'bg-gray-800 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-600/80 to-orange-500/80 hover:from-orange-600 hover:to-orange-500 shadow-lg shadow-orange-500/25 active:scale-[0.98]'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-300">
                                        LOWER
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-white'}`}>
                                    Posteriores de Perna
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-white/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-white'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>

                    {/* Cardio Button */}
                    <button
                        onClick={() => onStartWorkout('cardio')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-300 ${currentSession
                            ? 'bg-gray-800 cursor-not-allowed'
                            : 'bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 hover:from-yellow-600 hover:to-yellow-500 shadow-lg shadow-yellow-500/25 active:scale-[0.98]'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-300">
                                        CARDIO
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-white'}`}>
                                    Corrida, Caminhada, Abdominal
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-white/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-white'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>
                </div>
            </section>

            {/* Weekly Summary */}
            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Resumo Semanal</h2>
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-surface-dark rounded-xl text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">{weeklySummary.daysTrainedCount}</p>
                        <p className="text-xs text-gray-400 mt-1">Dias</p>
                    </div>
                    <div className="p-4 bg-surface-dark rounded-xl text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-orange-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">{weeklySummary.totalSets}</p>
                        <p className="text-xs text-gray-400 mt-1">Séries</p>
                    </div>
                    <div className="p-4 bg-surface-dark rounded-xl text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {weeklySummary.totalVolume > 1000
                                ? `${(weeklySummary.totalVolume / 1000).toFixed(1)}k`
                                : weeklySummary.totalVolume}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Volume (kg)</p>
                    </div>
                </div>
            </section>

            {/* Recent Workouts */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Treinos Recentes</h2>
                </div>

                {recentWorkouts.length === 0 ? (
                    <div className="p-6 bg-surface-dark rounded-xl text-center">
                        <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">Nenhum treino registrado ainda</p>
                        <p className="text-gray-500 text-sm mt-1">Comece seu primeiro treino!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentWorkouts.map((workout) => {
                            const dayColor = DAY_COLORS[workout.dayType];
                            const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);

                            return (
                                <div
                                    key={workout.id}
                                    className="flex items-center justify-between p-4 bg-surface-dark rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg ${dayColor.bg} flex items-center justify-center`}>
                                            <span className={`text-xs font-bold ${dayColor.text}`}>
                                                {DAY_NAMES[workout.dayType].slice(0, 2)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{DAY_NAMES[workout.dayType]}</p>
                                            <p className="text-gray-400 text-sm">
                                                {new Date(workout.date).toLocaleDateString('pt-BR', {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-medium">{totalSets} séries</p>
                                        {workout.duration && (
                                            <p className="text-gray-400 text-sm">{workout.duration} min</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
