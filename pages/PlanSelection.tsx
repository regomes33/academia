import React from 'react';
import { ArrowLeft, Calendar, ChevronRight, Repeat, Check } from 'lucide-react';
import { Plan } from '../types';
import { WORKOUT_PLANS, DAY_NAMES, DAY_COLORS } from '../data/workoutPlans';
import { useApp } from '../context/AppContext';

interface PlanSelectionProps {
    onBack: () => void;
    onPlanSelected: () => void;
}

const PlanSelection: React.FC<PlanSelectionProps> = ({ onBack, onPlanSelected }) => {
    const { settings, updateSettings } = useApp();

    const handleSelectPlan = (planId: string) => {
        updateSettings({ selectedPlanId: planId });
        onPlanSelected();
    };

    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-background-dark/95 backdrop-blur-sm">
                <button
                    onClick={onBack}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/5 transition-colors"
                    aria-label="Voltar"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold text-white">Sua Rotina PPL</h1>
            </header>

            {/* Content */}
            <main className="px-4 pt-2 space-y-6">
                {/* Intro */}
                <section>
                    <h2 className="text-2xl font-extrabold text-white">Escolha seu Plano</h2>
                    <p className="mt-2 text-gray-400">
                        Selecione a divisão semanal que melhor se adapta à sua rotina e objetivos.
                    </p>
                </section>

                {/* Plans List */}
                <section className="space-y-4">
                    {WORKOUT_PLANS.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            isSelected={settings.selectedPlanId === plan.id}
                            onSelect={() => handleSelectPlan(plan.id)}
                        />
                    ))}
                </section>
            </main>
        </div>
    );
};

interface PlanCardProps {
    plan: Plan;
    isSelected: boolean;
    onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
    const FocusIcon = plan.focusIcon;

    return (
        <div
            onClick={onSelect}
            className={`relative w-full rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-dark' : ''
                }`}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${plan.imageUrl}")` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-transparent" />

            {/* Content */}
            <div className="relative p-5 pt-32">
                {/* Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    {isSelected && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-5 h-5 text-background-dark" strokeWidth={3} />
                        </div>
                    )}
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${plan.badgeType === 'solid'
                                ? 'bg-primary text-background-dark'
                                : 'bg-background-dark/80 backdrop-blur-sm border border-white/10 text-white'
                            }`}
                    >
                        {plan.badge}
                    </span>
                </div>

                {/* Days Badge */}
                <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-primary text-sm font-bold uppercase tracking-wider">
                        {plan.daysPerWeek} Dias / Semana
                    </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-white">{plan.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{plan.description}</p>

                {/* Schedule Preview */}
                <div className="flex gap-1 mt-3">
                    {plan.schedule.map((day, idx) => (
                        <div
                            key={idx}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${DAY_COLORS[day].bg} ${DAY_COLORS[day].text}`}
                        >
                            {DAY_NAMES[day].slice(0, 1)}
                        </div>
                    ))}
                </div>

                <div className="h-px w-full bg-white/10 my-3" />

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <Repeat className="w-4 h-4" />
                            <span className="text-gray-200 text-sm">Frequência: {plan.frequency}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <FocusIcon className="w-4 h-4" />
                            <span className="text-gray-200 text-sm">Foco: {plan.focus}</span>
                        </div>
                    </div>

                    <button
                        className={`flex shrink-0 w-10 h-10 items-center justify-center rounded-full transition-all ${isSelected
                                ? 'bg-primary text-background-dark'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                        aria-label="Selecionar plano"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanSelection;
