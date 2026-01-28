import { LucideIcon } from 'lucide-react';

// Workout Plan Types
export interface Plan {
  id: string;
  badge: string;
  badgeType: 'outline' | 'solid';
  daysPerWeek: number;
  title: string;
  description: string;
  frequency: string;
  focus: string;
  focusIcon: LucideIcon;
  imageUrl: string;
  schedule: DayType[];
}

export type DayType = 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'cardio' | 'rest';
export type MuscleGroup = 'chest' | 'shoulders' | 'triceps' | 'back' | 'biceps' | 'quads' | 'hamstrings' | 'glutes' | 'calves';

// Exercise Input Types for different exercise categories
export type ExerciseInputType = 'weight_reps' | 'distance_time' | 'reps_only' | 'time_only' | 'time_reps';

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  category: DayType;
  muscleGroups: MuscleGroup[];
  description?: string;
  inputType?: ExerciseInputType; // Default is 'weight_reps'
}

// Workout Logging Types
export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  // Cardio-specific fields
  distance?: number; // in km
  time?: number; // in seconds
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
  notes?: string;
  timestamp: number;
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO date string
  planId: string;
  dayType: DayType;
  exercises: ExerciseLog[];
  completed: boolean;
  duration?: number; // in minutes
  createdAt: number;
  completedAt?: number;
}

// User Settings
export interface UserSettings {
  selectedPlanId: string | null;
  restTimerDuration: number; // in seconds
  darkMode: boolean;
  userName?: string;
}

// History & Stats
export interface WeeklySummary {
  weekStart: string;
  daysTrainedCount: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number; // weight × reps
  workoutIds: string[];
}

export interface ExerciseHistory {
  exerciseId: string;
  logs: {
    date: string;
    maxWeight: number;
    totalSets: number;
    totalReps: number;
  }[];
}
