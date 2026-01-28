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
    const getNextWorkoutDay = React.useMemo((): DayType => {
        if (!selectedPlan) return 'push';
        const dayOfWeek = new Date().getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        return selectedPlan.schedule[adjustedDay] || 'push';
    }, [selectedPlan]);

    const nextWorkoutDay = getNextWorkoutDay;
    const isRestDay = nextWorkoutDay === 'rest';

    return (
        <div className="flex flex-col gap-6 pb-24 stagger-children">
            {/* Welcome Section */}
            <section className="space-y-1">
                <p className="text-text-secondary text-sm">Bem-vindo de volta</p>
                <h1 className="text-3xl font-bold text-white">
                    {settings.userName || 'Atleta'} 💪
                </h1>
            </section>

            {/* Plan Selection or Current Plan */}
            {!selectedPlan ? (
                <button
                    onClick={onSelectPlan}
                    className="flex items-center justify-between p-4 bg-surface-dark rounded-sm border border-primary/30 hover:border-primary/50 transition-all duration-250 hover-scale"
                    aria-label="Escolher plano de treino"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-sm bg-primary/20 flex items-center justify-center">
                            <Dumbbell className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-semibold">Escolha seu plano</p>
                            <p className="text-text-secondary text-sm">Selecione uma rotina PPL</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-secondary" />
                </button>
            ) : (
                <div className="p-4 bg-surface-dark rounded-sm border border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-xs uppercase tracking-wider">Plano Atual</p>
                            <p className="text-white font-semibold mt-1">{selectedPlan.title}</p>
                            <p className="text-text-secondary text-sm">{selectedPlan.daysPerWeek} dias/semana</p>
                        </div>
                        <button
                            onClick={onSelectPlan}
                            className="text-primary text-sm font-medium hover:underline"
                            aria-label="Alterar plano de treino"
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
                    {/* Push Button - RED accent following plan */}
                    <button
                        onClick={() => onStartWorkout('push')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-sm transition-all duration-250 hover-scale ${currentSession
                            ? 'bg-gray-800 cursor-not-allowed'
                            : 'bg-accent-red hover:shadow-glow-red active:scale-95'
                            }`}
                        aria-label="Iniciar treino Push: Peito, Ombros, Tríceps"
                        aria-disabled={!!currentSession}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-sm text-xs font-bold bg-white/20 text-white">
                                        PUSH
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-white'}`}>
                                    Peito, Ombros, Tríceps
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-sm flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-white/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-white'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>

                    {/* Pull Button - BLUE accent */}
                    <button
                        onClick={() => onStartWorkout('pull')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-sm transition-all duration-250 hover-scale ${currentSession
                            ? 'bg-gray-800 cursor-not-allowed'
                            : 'bg-accent-blue hover:shadow-glow-blue active:scale-95'
                            }`}
                        aria-label="Iniciar treino Pull: Costas, Bíceps"
                        aria-disabled={!!currentSession}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-sm text-xs font-bold bg-white/20 text-white">
                                        PULL
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-white'}`}>
                                    Costas, Bíceps
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-sm flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-white/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-white'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>

                    {/* Legs Button - PRIMARY green */}
                    <button
                        onClick={() => onStartWorkout('legs')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-sm transition-all duration-250 hover-scale ${currentSession
                            ? 'bg-gray-800 cursor-not-allowed'
                            : 'bg-primary hover:shadow-glow-primary active:scale-95'
                            }`}
                        aria-label="Iniciar treino Legs: Pernas"
                        aria-disabled={!!currentSession}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-sm text-xs font-bold bg-black/20 text-black">
                                        LEGS
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-black'}`}>
                                    Pernas
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-sm flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-black/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-black'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>

                    {/* Upper Body Button - Changed from PURPLE to GREEN-BLUE gradient */}
                    <button
                        onClick={() => onStartWorkout('upper')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-sm transition-all duration-250 hover-scale ${currentSession
                                ? 'bg-gray-800 cursor-not-allowed'
                                : 'bg-gradient-to-r from-primary to-accent-blue hover:shadow-glow-primary active:scale-95'
                            }`}
                        aria-label="Iniciar treino Upper: Superiores Completo"
                        aria-disabled={!!currentSession}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-sm text-xs font-bold bg-black/20 text-black">
                                        UPPER
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-black'}`}>
                                    Superiores Completo
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-sm flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-black/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-black'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>

                    {/* Lower Body Button - ORANGE accent */}
                    <button
                        onClick={() => onStartWorkout('lower')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-sm transition-all duration-250 hover-scale ${currentSession
                                ? 'bg-gray-800 cursor-not-allowed'
                                : 'bg-accent-orange hover:shadow-lg active:scale-95'
                            }`}
                        aria-label="Iniciar treino Lower: Posteriores de Perna"
                        aria-disabled={!!currentSession}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-sm text-xs font-bold bg-white/20 text-white">
                                        LOWER
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-white'}`}>
                                    Posteriores de Perna
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-sm flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-white/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-white'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>

                    {/* Cardio Button - YELLOW accent */}
                    <button
                        onClick={() => onStartWorkout('cardio')}
                        disabled={!!currentSession}
                        className={`relative overflow-hidden p-6 rounded-sm transition-all duration-250 hover-scale ${currentSession
                            ? 'bg-gray-800 cursor-not-allowed'
                            : 'bg-accent-yellow hover:shadow-lg active:scale-95'
                            }`}
                        aria-label="Iniciar treino Cardio: Corrida, Caminhada, Abdominal"
                        aria-disabled={!!currentSession}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-sm text-xs font-bold bg-black/20 text-black">
                                        CARDIO
                                    </span>
                                </div>
                                <p className={`text-lg font-bold ${currentSession ? 'text-gray-400' : 'text-black'}`}>
                                    Corrida, Caminhada, Abdominal
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-sm flex items-center justify-center ${currentSession ? 'bg-gray-700' : 'bg-black/20'
                                }`}>
                                <Play className={`w-7 h-7 ${currentSession ? 'text-gray-500' : 'text-black'}`} fill="currentColor" />
                            </div>
                        </div>
                    </button>
                </div>
            </section>

            {/* Weekly Summary */}
            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Resumo Semanal</h2>
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-surface-dark rounded-sm text-center hover-lift">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-sm bg-accent-blue/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-accent-blue" />
                        </div>
                        <p className="text-2xl font-bold text-white">{weeklySummary.daysTrainedCount}</p>
                        <p className="text-xs text-text-secondary mt-1">Dias</p>
                    </div>
                    <div className="p-4 bg-surface-dark rounded-sm text-center hover-lift">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-sm bg-accent-orange/20 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-accent-orange" />
                        </div>
                        <p className="text-2xl font-bold text-white">{weeklySummary.totalSets}</p>
                        <p className="text-xs text-text-secondary mt-1">Séries</p>
                    </div>
                    <div className="p-4 bg-surface-dark rounded-sm text-center hover-lift">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-sm bg-primary/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {weeklySummary.totalVolume > 1000
                                ? `${(weeklySummary.totalVolume / 1000).toFixed(1)}k`
                                : weeklySummary.totalVolume}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">Volume (kg)</p>
                    </div>
                </div>
            </section>

            {/* Recent Workouts */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Treinos Recentes</h2>
                </div>

                {recentWorkouts.length === 0 ? (
                    <div className="p-8 bg-surface-dark rounded-sm text-center border border-white/5">
                        <Dumbbell className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                        <p className="text-text-secondary">Nenhum treino registrado ainda</p>
                        <p className="text-text-tertiary text-sm mt-1">Comece seu primeiro treino!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentWorkouts.map((workout) => {
                            const dayColor = DAY_COLORS[workout.dayType];
                            const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);

                            return (
                                <div
                                    key={workout.id}
                                    className="flex items-center justify-between p-4 bg-surface-dark rounded-sm hover-lift"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-sm ${dayColor.bg} flex items-center justify-center`}>
                                            <span className={`text-xs font-bold ${dayColor.text}`}>
                                                {DAY_NAMES[workout.dayType].slice(0, 2)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{DAY_NAMES[workout.dayType]}</p>
                                            <p className="text-text-secondary text-sm">
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
                                            <p className="text-text-secondary text-sm">{workout.duration} min</p>
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
