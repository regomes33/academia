import React from 'react';
import { Calendar, ChevronRight, Repeat } from 'lucide-react';
import { Plan } from '../types';

interface PlanCardProps {
  plan: Plan;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const FocusIcon = plan.focusIcon;

  return (
    <div className="relative w-full h-[320px] rounded-xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url("${plan.imageUrl}")` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-card-gradient" />

      {/* Badge */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        plan.badgeType === 'solid' 
          ? 'bg-primary text-background-dark shadow-lg' 
          : 'bg-background-dark/80 backdrop-blur-sm border border-white/10 text-primary'
      }`}>
        {plan.badge === 'Avançado' && plan.badgeType !== 'solid' ? (
             <span className="text-white">{plan.badge}</span>
        ) : (
             <span>{plan.badge}</span>
        )}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col gap-3">
        
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-primary text-sm font-bold tracking-wider uppercase">
              {plan.daysPerWeek} Dias / Semana
            </span>
          </div>
          <h3 className="text-white tracking-tight text-2xl font-bold leading-tight">
            {plan.title}
          </h3>
          <p className="text-gray-300 text-sm font-medium leading-relaxed">
            {plan.description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10 my-1" />

        {/* Footer Section */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
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
            className="flex shrink-0 w-10 h-10 items-center justify-center rounded-full bg-primary text-background-dark shadow-[0_0_10px_rgba(19,236,19,0.4)] transition-transform group-hover:translate-x-1"
            aria-label="Selecionar plano"
          >
            <ChevronRight className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;