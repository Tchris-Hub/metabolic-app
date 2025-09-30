export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'breathing';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  calories: number; // per hour
  equipment: 'none' | 'minimal' | 'moderate' | 'full';
  targetMuscles: string[];
  benefits: string[];
  instructions: string[];
  modifications: {
    easier: string;
    harder: string;
  };
  precautions: string[];
  tags: string[];
  videoUrl?: string;
  imageUrl?: string;
}

export const exercises: Exercise[] = [
  {
    id: 'walking',
    name: 'Brisk Walking',
    description: 'A low-impact cardiovascular exercise perfect for beginners',
    category: 'cardio',
    difficulty: 'beginner',
    duration: 30,
    calories: 200,
    equipment: 'none',
    targetMuscles: ['legs', 'glutes', 'core'],
    benefits: [
      'Improves cardiovascular health',
      'Helps with blood sugar control',
      'Low impact on joints',
      'Can be done anywhere'
    ],
    instructions: [
      'Start with a 5-minute warm-up at a comfortable pace',
      'Gradually increase your pace to a brisk walk',
      'Maintain good posture: shoulders back, core engaged',
      'Swing your arms naturally',
      'Take deep, steady breaths',
      'Cool down with 5 minutes of slower walking'
    ],
    modifications: {
      easier: 'Walk at a comfortable pace, take breaks as needed',
      harder: 'Add hills, increase pace, or carry light weights'
    },
    precautions: [
      'Stop if you feel chest pain or shortness of breath',
      'Wear comfortable, supportive shoes',
      'Stay hydrated',
      'Avoid walking in extreme weather'
    ],
    tags: ['low-impact', 'beginner-friendly', 'outdoor', 'indoor'],
    videoUrl: 'https://example.com/walking-video'
  },
  {
    id: 'bodyweight-squats',
    name: 'Bodyweight Squats',
    description: 'A fundamental strength exercise that targets the lower body',
    category: 'strength',
    difficulty: 'beginner',
    duration: 10,
    calories: 80,
    equipment: 'none',
    targetMuscles: ['quadriceps', 'glutes', 'hamstrings', 'core'],
    benefits: [
      'Builds lower body strength',
      'Improves balance and coordination',
      'Helps with daily activities',
      'No equipment needed'
    ],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep your chest up and core engaged',
      'Lower your body as if sitting back into a chair',
      'Go down until your thighs are parallel to the floor',
      'Push through your heels to return to standing',
      'Keep your knees in line with your toes'
    ],
    modifications: {
      easier: 'Use a chair for support or reduce depth',
      harder: 'Add a jump at the top or hold weights'
    },
    precautions: [
      'Stop if you feel knee pain',
      'Keep your knees behind your toes',
      'Don\'t let your knees cave inward',
      'Start with fewer repetitions'
    ],
    tags: ['strength', 'beginner-friendly', 'no-equipment', 'lower-body'],
    videoUrl: 'https://example.com/squats-video'
  },
  {
    id: 'yoga-flow',
    name: 'Gentle Yoga Flow',
    description: 'A calming sequence of yoga poses for flexibility and relaxation',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 20,
    calories: 60,
    equipment: 'minimal',
    targetMuscles: ['full-body'],
    benefits: [
      'Improves flexibility and mobility',
      'Reduces stress and anxiety',
      'Enhances balance',
      'Promotes relaxation'
    ],
    instructions: [
      'Start in a comfortable seated position',
      'Begin with gentle neck rolls and shoulder shrugs',
      'Move into cat-cow stretches on hands and knees',
      'Flow through downward dog and child\'s pose',
      'Include gentle twists and forward folds',
      'End with a few minutes of relaxation'
    ],
    modifications: {
      easier: 'Use props like blocks or straps, hold poses for shorter time',
      harder: 'Hold poses longer, add more challenging variations'
    },
    precautions: [
      'Listen to your body and don\'t push beyond comfort',
      'Avoid poses that cause pain',
      'Use props for support if needed',
      'Breathe deeply throughout'
    ],
    tags: ['flexibility', 'stress-relief', 'mindfulness', 'low-impact'],
    videoUrl: 'https://example.com/yoga-video'
  },
  {
    id: 'breathing-exercises',
    name: 'Deep Breathing Exercises',
    description: 'Controlled breathing techniques for stress reduction and relaxation',
    category: 'breathing',
    difficulty: 'beginner',
    duration: 5,
    calories: 10,
    equipment: 'none',
    targetMuscles: ['diaphragm', 'core'],
    benefits: [
      'Reduces stress and anxiety',
      'Improves focus and concentration',
      'Helps with blood pressure control',
      'Promotes better sleep'
    ],
    instructions: [
      'Find a comfortable seated or lying position',
      'Place one hand on your chest and one on your belly',
      'Inhale slowly through your nose for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly through your mouth for 6 counts',
      'Repeat for 5-10 cycles'
    ],
    modifications: {
      easier: 'Start with shorter counts or fewer cycles',
      harder: 'Increase the count ratio or add visualization'
    },
    precautions: [
      'Stop if you feel dizzy or lightheaded',
      'Don\'t force the breath',
      'Start slowly and gradually increase',
      'Consult a doctor if you have breathing problems'
    ],
    tags: ['stress-relief', 'mindfulness', 'relaxation', 'no-equipment'],
    videoUrl: 'https://example.com/breathing-video'
  }
];

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(exercise => exercise.id === id);
};

export const getExercisesByCategory = (category: string): Exercise[] => {
  return exercises.filter(exercise => exercise.category === category);
};

export const getExercisesByDifficulty = (difficulty: string): Exercise[] => {
  return exercises.filter(exercise => exercise.difficulty === difficulty);
};

export const getExercisesByEquipment = (equipment: string): Exercise[] => {
  return exercises.filter(exercise => exercise.equipment === equipment);
};

export const searchExercises = (query: string): Exercise[] => {
  const lowercaseQuery = query.toLowerCase();
  return exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(lowercaseQuery) ||
    exercise.description.toLowerCase().includes(lowercaseQuery) ||
    exercise.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

