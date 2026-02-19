import { Dumbbell, Zap, TrendingUp, Trophy } from 'lucide-react';
import { Plan } from './types';

export const WORKOUT_PLANS: Plan[] = [
  {
    id: 'beginner',
    badge: 'Iniciante',
    badgeType: 'outline',
    daysPerWeek: 3,
    title: 'PPL Clássico',
    description: 'Push • Pull • Legs • Descanso',
    frequency: '1x/semana',
    focus: 'Adaptação & Força',
    focusIcon: Dumbbell,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCETbx-7B2cTDAZeFfnPJw8y4vB_Ff0uxKE-0PKsMSfvyR0SLp6CMS6e23B5uINulrnRaG89j4JHsUcAROeBvMwZLo5N5wZJVspmWbObmrRbi-GbyBxP4_kCtV_IBgAPrO8zMxgDpNpMueSSkmmzOni4IjtBs1tVDwifl_ZLL6tDwDknVrUUQqLul2kxgevaIjO_QcS9wP_AByirrNLiTvLaBCynntNev1iEZg5kMkBftUhuKurNeJI6aYPEwJDrv5rcGPSNrY3dLXS',
    schedule: ['push', 'rest', 'pull', 'rest', 'legs', 'rest', 'rest']
  },
  {
    id: 'intermediate',
    badge: 'Intermediário',
    badgeType: 'outline',
    daysPerWeek: 4,
    title: 'PPL Híbrido',
    description: 'Push • Pull • Legs • Upper/Lower',
    frequency: '1.5x/semana',
    focus: 'Hipertrofia Moderada',
    focusIcon: Zap,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsMLVYPaPqd4EWdXL2MF5qpjOUyep922UvONdVGnxG5SQwCJFh8szhMy1IogvEwq43p5RkTBlQ3jpvkL_cZkoJs6umNtNXAxjbnItOkSEm6N119Ylc9pmNDNBRWDh1tgiualDjeg8FlMwQ2yBiSCPFuGcM9zxrIIOy3n5GcZ_2KeBo14AlguYIm9dtL2i699JQGSaItdKN01G-Fd7EAn_zSu_EFkh0MsUBWd40BUtsfzwzDoLdoDjTowwFYkbGR52aaZgN_kMCroNU',
    schedule: ['push', 'pull', 'rest', 'legs', 'push', 'rest', 'rest']
  },
  {
    id: 'advanced',
    badge: 'Avançado',
    badgeType: 'outline',
    daysPerWeek: 5,
    title: 'PPL Rotativo',
    description: 'Ciclo contínuo de Push • Pull • Legs',
    frequency: 'Alta (Rotativa)',
    focus: 'Volume & Estética',
    focusIcon: TrendingUp,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt3NqbvptjoSMIc9muJYItRDQBXdHcqP2XNuw4RXf5yeX9I12oou11Q6eITQBkdc28yt-MPPG1-G0ftzbZ-OAVY360bmr1Y__Ls8bqWZZ-W9qIcVdJGpVpCjUo2tX1RkI8AP6-EaDXJgVL1U6YMFl3UAmC_V7EwLT8w0j4iDSATISl-bkOTrUrmrQpLHPVtBCR9CPMCZsccHbOjVw0C7cJDhAPm8dzypdxz6qgxTrlDH6RphkNSDBiZv3bebhBfFlCvxIPk_G0-0XC',
    schedule: ['push', 'pull', 'legs', 'push', 'pull', 'rest', 'rest']
  },
  {
    id: 'elite',
    badge: 'Elite',
    badgeType: 'solid',
    daysPerWeek: 6,
    title: 'PPL 2x (Arnold Split)',
    description: 'PPL • PPL • Descanso',
    frequency: '2x/semana',
    focus: 'Máxima Hipertrofia',
    focusIcon: Trophy,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2tPrf7Nf3rHDYHq3w8v8JtgT_rxsTjFrr-PGxZQF3I2ytnJNQ8P8p6zON-kd-dtNc8ZZBQb-JdSjgfX-nt5psdzPWDu9NAdpSrpyNbWWg-5GInts5aUKdtNvuUZcw_GyOKBJST2uRD0O5fgZ3BdNyN19swMLaaeJwjyCOpDhG3tIdiDkQ76BuTgRbC6cvtEHPpYr0l_IROdVeaCTIsr8Gs13YqmGNKjaAsD2IEQKtBg7P25QqP1AYaHk3UDJ_Z_CrEMD2Sw8Hxp2',
    schedule: ['push', 'pull', 'legs', 'push', 'pull', 'legs', 'rest']
  }
];
