import { Dumbbell, Zap, TrendingUp, Trophy } from 'lucide-react';
import { Plan, DayType } from '../types';

// Workout plan configurations with weekly schedules
export const WORKOUT_PLANS: Plan[] = [
    {
        id: 'ppl-3',
        badge: 'Iniciante',
        badgeType: 'outline',
        daysPerWeek: 3,
        title: 'PPL Clássico',
        description: 'Push • Pull • Legs • Descanso',
        frequency: '1x/semana por grupo',
        focus: 'Adaptação & Força',
        focusIcon: Dumbbell,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCETbx-7B2cTDAZeFfnPJw8y4vB_Ff0uxKE-0PKsMSfvyR0SLp6CMS6e23B5uINulrnRaG89j4JHsUcAROeBvMwZLo5N5wZJVspmWbObmrRbi-GbyBxP4_kCtV_IBgAPrO8zMxgDpNpMueSSkmmzOni4IjtBs1tVDwifl_ZLL6tDwDknVrUUQqLul2kxgevaIjO_QcS9wP_AByirrNLiTvLaBCynntNev1iEZg5kMkBftUhuKurNeJI6aYPEwJDrv5rcGPSNrY3dLXS',
        schedule: ['push', 'rest', 'pull', 'rest', 'legs', 'rest', 'rest']
    },
    {
        id: 'ppl-4',
        badge: 'Intermediário',
        badgeType: 'outline',
        daysPerWeek: 4,
        title: 'PPL Híbrido',
        description: 'Push • Pull • Legs • Push',
        frequency: '1.5x/semana por grupo',
        focus: 'Hipertrofia Moderada',
        focusIcon: Zap,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsMLVYPaPqd4EWdXL2MF5qpjOUyep922UvONdVGnxG5SQwCJFh8szhMy1IogvEwq43p5RkTBlQ3jpvkL_cZkoJs6umNtNXAxjbnItOkSEm6N119Ylc9pmNDNBRWDh1tgiualDjeg8FlMwQ2yBiSCPFuGcM9zxrIIOy3n5GcZ_2KeBo14AlguYIm9dtL2i699JQGSaItdKN01G-Fd7EAn_zSu_EFkh0MsUBWd40BUtsfzwzDoLdoDjTowwFYkbGR52aaZgN_kMCroNU',
        schedule: ['push', 'pull', 'rest', 'legs', 'push', 'rest', 'rest']
    },
    {
        id: 'ppl-5',
        badge: 'Avançado',
        badgeType: 'outline',
        daysPerWeek: 5,
        title: 'PPL Rotativo',
        description: 'Ciclo contínuo Push • Pull • Legs',
        frequency: 'Alta (Rotativa)',
        focus: 'Volume & Estética',
        focusIcon: TrendingUp,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt3NqbvptjoSMIc9muJYItRDQBXdHcqP2XNuw4RXf5yeX9I12oou11Q6eITQBkdc28yt-MPPG1-G0ftzbZ-OAVY360bmr1Y__Ls8bqWZZ-W9qIcVdJGpVpCjUo2tX1RkI8AP6-EaDXJgVL1U6YMFl3UAmC_V7EwLT8w0j4iDSATISl-bkOTrUrmrQpLHPVtBCR9CPMCZsccHbOjVw0C7cJDhAPm8dzypdxz6qgxTrlDH6RphkNSDBiZv3bebhBfFlCvxIPk_G0-0XC',
        schedule: ['push', 'pull', 'legs', 'push', 'pull', 'rest', 'rest']
    },
    {
        id: 'ppl-6',
        badge: 'Elite',
        badgeType: 'solid',
        daysPerWeek: 6,
        title: 'PPL 2x (Arnold Split)',
        description: 'Push • Pull • Legs • Push • Pull • Legs',
        frequency: '2x/semana por grupo',
        focus: 'Máxima Hipertrofia',
        focusIcon: Trophy,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2tPrf7Nf3rHDYHq3w8v8JtgT_rxsTjFrr-PGxZQF3I2ytnJNQ8P8p6zON-kd-dtNc8ZZBQb-JdSjgfX-nt5psdzPWDu9NAdpSrpyNbWWg-5GInts5aUKdtNvuUZcw_GyOKBJST2uRD0O5fgZ3BdNyN19swMLaaeJwjyCOpDhG3tIdiDkQ76BuTgRbC6cvtEHPpYr0l_IROdVeaCTIsr8Gs13YqmGNKjaAsD2IEQKtBg7P25QqP1AYaHk3UDJ_Z_CrEMD2Sw8Hxp2',
        schedule: ['push', 'pull', 'legs', 'push', 'pull', 'legs', 'rest']
    }
];

// Day names in Portuguese
export const DAY_NAMES: Record<DayType, string> = {
    push: 'PUSH',
    pull: 'PULL',
    legs: 'LEGS',
    upper: 'UPPER',
    lower: 'LOWER',
    cardio: 'CARDIO',
    rest: 'Descanso'
};

// Day colors for UI
export const DAY_COLORS: Record<DayType, { bg: string; text: string; border: string }> = {
    push: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    pull: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    legs: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    upper: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    lower: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    cardio: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    rest: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' }
};

// Day descriptions
export const DAY_DESCRIPTIONS: Record<DayType, string> = {
    push: 'Peito, Ombros, Tríceps',
    pull: 'Costas, Bíceps',
    legs: 'Quadríceps, Panturrilha',
    upper: 'Superiores Completo',
    lower: 'Posteriores de Perna',
    cardio: 'Corrida, Caminhada, Abdominal',
    rest: 'Recuperação muscular'
};

// Helper function to get plan by ID
export const getPlanById = (id: string): Plan | undefined => {
    return WORKOUT_PLANS.find(plan => plan.id === id);
};

// Get today's workout type based on plan and day of week
export const getTodayWorkout = (planId: string): DayType => {
    const plan = getPlanById(planId);
    if (!plan) return 'rest';

    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Shift to make Monday = 0
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return plan.schedule[adjustedDay];
};
