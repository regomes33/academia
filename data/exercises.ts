import { Exercise } from '../types';

// PUSH Exercises (Peito, Ombros, Tríceps) - Segunda-feira
export const PUSH_EXERCISES: Exercise[] = [
    {
        id: 'supino-inclinado-halteres',
        name: 'Supino Inclinado Halteres',
        category: 'push',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        description: 'Supino inclinado com halteres'
    },
    {
        id: 'crucifixo-maquina',
        name: 'Crucifixo Máquina',
        category: 'push',
        muscleGroups: ['chest'],
        description: 'Crucifixo na máquina'
    },
    {
        id: 'cross-over',
        name: 'Cross Over',
        category: 'push',
        muscleGroups: ['chest'],
        description: 'Cross over no cabo'
    },
    {
        id: 'elevacao-lateral',
        name: 'Elevação Lateral',
        category: 'push',
        muscleGroups: ['shoulders'],
        description: 'Elevação lateral com halteres'
    },
    {
        id: 'desenvolvimento-maquina',
        name: 'Desenvolvimento Máquina',
        category: 'push',
        muscleGroups: ['shoulders', 'triceps'],
        description: 'Desenvolvimento na máquina'
    },
    {
        id: 'triceps-frances-corda',
        name: 'Tríceps Francês Corda',
        category: 'push',
        muscleGroups: ['triceps'],
        description: 'Tríceps francês com corda'
    },
    {
        id: 'triceps-pe-cabo-barra-w',
        name: 'Tríceps em Pé Cabo Barra W',
        category: 'push',
        muscleGroups: ['triceps'],
        description: 'Tríceps em pé no cabo com barra W'
    }
];

// PULL Exercises (Costas, Bíceps) - Terça-feira
export const PULL_EXERCISES: Exercise[] = [
    {
        id: 'puxada-alta-frente',
        name: 'Puxada Alta Frente',
        category: 'pull',
        muscleGroups: ['back', 'biceps'],
        description: 'Puxada alta frontal'
    },
    {
        id: 'remada-curvada',
        name: 'Remada Curvada',
        category: 'pull',
        muscleGroups: ['back'],
        description: 'Remada curvada com barra'
    },
    {
        id: 'pulldown',
        name: 'Pulldown',
        category: 'pull',
        muscleGroups: ['back'],
        description: 'Pulldown no cabo'
    },
    {
        id: 'crucifixo-inverso-maquina',
        name: 'Crucifixo Inverso Máquina',
        category: 'pull',
        muscleGroups: ['back', 'shoulders'],
        description: 'Crucifixo inverso na máquina'
    },
    {
        id: 'rosca-direta-barra-w',
        name: 'Rosca Direta Barra W',
        category: 'pull',
        muscleGroups: ['biceps'],
        description: 'Rosca direta com barra W'
    },
    {
        id: 'rosca-scott',
        name: 'Rosca Scott',
        category: 'pull',
        muscleGroups: ['biceps'],
        description: 'Rosca scott no banco'
    }
];

// LEGS Exercises (Quadríceps) - Quarta-feira
export const LEGS_EXERCISES: Exercise[] = [
    {
        id: 'extensora',
        name: 'Extensora',
        category: 'legs',
        muscleGroups: ['quads'],
        description: 'Cadeira extensora'
    },
    {
        id: 'agachamento-livre',
        name: 'Agachamento Livre',
        category: 'legs',
        muscleGroups: ['quads', 'glutes'],
        description: 'Agachamento livre com barra'
    },
    {
        id: 'leg-45',
        name: 'Leg 45',
        category: 'legs',
        muscleGroups: ['quads', 'glutes'],
        description: 'Leg press 45'
    },
    {
        id: 'bulgaro',
        name: 'Búlgaro',
        category: 'legs',
        muscleGroups: ['quads', 'glutes'],
        description: 'Agachamento búlgaro'
    },
    {
        id: 'cadeira-adutora',
        name: 'Cadeira Adutora',
        category: 'legs',
        muscleGroups: ['quads'],
        description: 'Cadeira adutora'
    },
    {
        id: 'gemeos-pe',
        name: 'Gêmeos em Pé',
        category: 'legs',
        muscleGroups: ['calves'],
        description: 'Panturrilha em pé'
    }
];

// UPPER BODY Exercises (Superiores) - Sexta-feira
export const UPPER_EXERCISES: Exercise[] = [
    {
        id: 'supino-maquina',
        name: 'Supino Máquina',
        category: 'upper',
        muscleGroups: ['chest'],
        description: 'Supino na máquina'
    },
    {
        id: 'remada-baixa',
        name: 'Remada Baixa',
        category: 'upper',
        muscleGroups: ['back'],
        description: 'Remada baixa no cabo'
    },
    {
        id: 'desenvolvimento-halteres',
        name: 'Desenvolvimento Halteres',
        category: 'upper',
        muscleGroups: ['shoulders'],
        description: 'Desenvolvimento com halteres'
    },
    {
        id: 'elevacao-frontal-corda',
        name: 'Elevação Frontal Corda',
        category: 'upper',
        muscleGroups: ['shoulders'],
        description: 'Elevação frontal com corda'
    },
    {
        id: 'rosca-martelo',
        name: 'Rosca Martelo',
        category: 'upper',
        muscleGroups: ['biceps'],
        description: 'Rosca martelo com halteres'
    },
    {
        id: 'triceps-testa-barra-w',
        name: 'Tríceps Testa Barra W',
        category: 'upper',
        muscleGroups: ['triceps'],
        description: 'Tríceps testa com barra W'
    }
];

// LOWER BODY Exercises (Posteriores) - Sábado
export const LOWER_EXERCISES: Exercise[] = [
    {
        id: 'stiff',
        name: 'Stiff',
        category: 'lower',
        muscleGroups: ['hamstrings', 'glutes'],
        description: 'Stiff com barra'
    },
    {
        id: 'mesa-flexora',
        name: 'Mesa Flexora',
        category: 'lower',
        muscleGroups: ['hamstrings'],
        description: 'Mesa flexora'
    },
    {
        id: 'cadeira-flexora',
        name: 'Cadeira Flexora',
        category: 'lower',
        muscleGroups: ['hamstrings'],
        description: 'Cadeira flexora'
    },
    {
        id: 'levantamento-terra-sumo',
        name: 'Levantamento Terra Sumô',
        category: 'lower',
        muscleGroups: ['hamstrings', 'glutes'],
        description: 'Levantamento terra sumô'
    },
    {
        id: 'cadeira-abdutora',
        name: 'Cadeira Abdutora',
        category: 'lower',
        muscleGroups: ['glutes'],
        description: 'Cadeira abdutora'
    },
    {
        id: 'gemeos-sentado',
        name: 'Gêmeos Sentado',
        category: 'lower',
        muscleGroups: ['calves'],
        description: 'Panturrilha sentado'
    }
];

// CARDIO Exercises (Cardio, Running, Walking, Abdominal)
export const CARDIO_EXERCISES: Exercise[] = [
    {
        id: 'corrida',
        name: 'Corrida',
        category: 'cardio',
        muscleGroups: [],
        description: 'Exercício cardiovascular de alta intensidade',
        inputType: 'distance_time'
    },
    {
        id: 'caminhada',
        name: 'Caminhada',
        category: 'cardio',
        muscleGroups: [],
        description: 'Exercício cardiovascular de baixa intensidade',
        inputType: 'distance_time'
    },
    {
        id: 'abdominal-reto',
        name: 'Abdominal Reto',
        category: 'cardio',
        muscleGroups: [],
        description: 'Exercício para região abdominal',
        inputType: 'reps_only'
    },
    {
        id: 'abdominal-obliquo',
        name: 'Abdominal Oblíquo',
        category: 'cardio',
        muscleGroups: [],
        description: 'Exercício para abdômen lateral',
        inputType: 'reps_only'
    },
    {
        id: 'prancha',
        name: 'Prancha',
        category: 'cardio',
        muscleGroups: [],
        description: 'Exercício isométrico para core',
        inputType: 'time_reps'
    },
    {
        id: 'burpee',
        name: 'Burpee',
        category: 'cardio',
        muscleGroups: [],
        description: 'Exercício explosivo de corpo inteiro',
        inputType: 'reps_only'
    }
];

// All exercises combined
export const ALL_EXERCISES: Exercise[] = [
    ...PUSH_EXERCISES,
    ...PULL_EXERCISES,
    ...LEGS_EXERCISES,
    ...UPPER_EXERCISES,
    ...LOWER_EXERCISES,
    ...CARDIO_EXERCISES
];

// Helper function to get exercises by category
export const getExercisesByCategory = (category: 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'cardio'): Exercise[] => {
    switch (category) {
        case 'push':
            return PUSH_EXERCISES;
        case 'pull':
            return PULL_EXERCISES;
        case 'legs':
            return LEGS_EXERCISES;
        case 'upper':
            return UPPER_EXERCISES;
        case 'lower':
            return LOWER_EXERCISES;
        case 'cardio':
            return CARDIO_EXERCISES;
        default:
            return [];
    }
};

// Helper function to get exercise by ID
export const getExerciseById = (id: string): Exercise | undefined => {
    return ALL_EXERCISES.find(ex => ex.id === id);
};
