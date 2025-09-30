export interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: 'nutrition' | 'exercise' | 'medication' | 'lifestyle' | 'monitoring' | 'prevention';
  targetConditions: string[];
  priority: 'high' | 'medium' | 'low';
  source: string;
  lastUpdated: string;
  tags: string[];
  actionable: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: number; // minutes
  benefits: string[];
  tips: string[];
}

export const healthTips: HealthTip[] = [
  {
    id: 'walk-after-meals',
    title: 'Take a 10-minute walk after meals',
    content: 'A short walk after eating can help lower blood sugar levels and improve digestion. This simple habit can reduce post-meal glucose spikes by up to 20%.',
    category: 'lifestyle',
    targetConditions: ['diabetes', 'prediabetes', 'obesity'],
    priority: 'high',
    source: 'American Diabetes Association',
    lastUpdated: '2024-01-15',
    tags: ['blood-sugar', 'exercise', 'digestion', 'simple'],
    actionable: true,
    difficulty: 'easy',
    timeRequired: 10,
    benefits: [
      'Lowers blood sugar levels',
      'Improves digestion',
      'Burns calories',
      'Reduces insulin resistance'
    ],
    tips: [
      'Start with just 5 minutes if 10 feels too long',
      'Walk at a comfortable pace - you should be able to hold a conversation',
      'Try walking around your house or office if weather is bad',
      'Set a reminder on your phone to walk after each meal',
      'Make it a family activity to stay motivated'
    ]
  },
  {
    id: 'stay-hydrated',
    title: 'Drink water before meals',
    content: 'Drinking a glass of water 30 minutes before meals can help with portion control and may improve blood sugar management.',
    category: 'nutrition',
    targetConditions: ['diabetes', 'obesity', 'hypertension'],
    priority: 'high',
    source: 'Mayo Clinic',
    lastUpdated: '2024-01-10',
    tags: ['hydration', 'portion-control', 'blood-sugar', 'simple'],
    actionable: true,
    difficulty: 'easy',
    timeRequired: 1,
    benefits: [
      'Helps with portion control',
      'Improves hydration',
      'May reduce blood sugar spikes',
      'Supports overall health'
    ],
    tips: [
      'Keep a water bottle nearby during meal prep',
      'Set a reminder to drink water before eating',
      'Try adding lemon or cucumber for flavor',
      'Aim for 8-10 glasses of water daily',
      'Check your urine color - it should be light yellow'
    ]
  },
  {
    id: 'check-labels',
    title: 'Read nutrition labels carefully',
    content: 'Always check the serving size, total carbohydrates, and added sugars on food labels. Look for foods with less than 5g of added sugar per serving.',
    category: 'nutrition',
    targetConditions: ['diabetes', 'prediabetes', 'obesity'],
    priority: 'high',
    source: 'FDA',
    lastUpdated: '2024-01-20',
    tags: ['nutrition', 'label-reading', 'carbohydrates', 'education'],
    actionable: true,
    difficulty: 'medium',
    timeRequired: 2,
    benefits: [
      'Better food choices',
      'Improved blood sugar control',
      'Increased awareness of hidden sugars',
      'Better portion control'
    ],
    tips: [
      'Start by checking the serving size - many packages contain multiple servings',
      'Look for "added sugars" in the ingredients list',
      'Choose foods with more fiber and less sodium',
      'Compare similar products to find the healthiest option',
      'Use a food tracking app to log your choices'
    ]
  },
  {
    id: 'medication-timing',
    title: 'Take medications at the same time daily',
    content: 'Consistent medication timing helps maintain steady blood levels and improves effectiveness. Set specific times for each medication.',
    category: 'medication',
    targetConditions: ['diabetes', 'hypertension', 'high-cholesterol'],
    priority: 'high',
    source: 'CDC',
    lastUpdated: '2024-01-12',
    tags: ['medication', 'consistency', 'timing', 'adherence'],
    actionable: true,
    difficulty: 'easy',
    timeRequired: 5,
    benefits: [
      'Better medication effectiveness',
      'Reduced side effects',
      'Improved health outcomes',
      'Easier to remember'
    ],
    tips: [
      'Use a pill organizer with days of the week',
      'Set phone alarms for each medication time',
      'Take medications with meals if recommended',
      'Keep a medication log to track adherence',
      'Ask your pharmacist about timing with other medications'
    ]
  },
  {
    id: 'sleep-hygiene',
    title: 'Maintain consistent sleep schedule',
    content: 'Getting 7-9 hours of quality sleep helps regulate blood sugar, blood pressure, and supports overall health. Go to bed and wake up at the same time daily.',
    category: 'lifestyle',
    targetConditions: ['diabetes', 'hypertension', 'obesity'],
    priority: 'medium',
    source: 'National Sleep Foundation',
    lastUpdated: '2024-01-18',
    tags: ['sleep', 'circadian-rhythm', 'blood-sugar', 'stress'],
    actionable: true,
    difficulty: 'medium',
    timeRequired: 0,
    benefits: [
      'Better blood sugar control',
      'Improved mood and energy',
      'Enhanced immune function',
      'Better weight management'
    ],
    tips: [
      'Create a relaxing bedtime routine',
      'Avoid screens 1 hour before bed',
      'Keep your bedroom cool and dark',
      'Avoid caffeine after 2 PM',
      'Try relaxation techniques like deep breathing'
    ]
  },
  {
    id: 'stress-management',
    title: 'Practice daily stress reduction',
    content: 'Chronic stress can raise blood sugar and blood pressure. Try 10 minutes of meditation, deep breathing, or gentle stretching daily.',
    category: 'lifestyle',
    targetConditions: ['diabetes', 'hypertension', 'obesity'],
    priority: 'medium',
    source: 'American Heart Association',
    lastUpdated: '2024-01-14',
    tags: ['stress', 'meditation', 'relaxation', 'mental-health'],
    actionable: true,
    difficulty: 'medium',
    timeRequired: 10,
    benefits: [
      'Lower blood pressure',
      'Improved blood sugar control',
      'Better sleep quality',
      'Enhanced mood'
    ],
    tips: [
      'Start with just 5 minutes of deep breathing',
      'Try guided meditation apps',
      'Practice gratitude journaling',
      'Take short breaks throughout the day',
      'Consider yoga or tai chi classes'
    ]
  }
];

export const getHealthTipById = (id: string): HealthTip | undefined => {
  return healthTips.find(tip => tip.id === id);
};

export const getHealthTipsByCategory = (category: string): HealthTip[] => {
  return healthTips.filter(tip => tip.category === category);
};

export const getHealthTipsByCondition = (condition: string): HealthTip[] => {
  return healthTips.filter(tip => 
    tip.targetConditions.includes(condition.toLowerCase())
  );
};

export const getHealthTipsByPriority = (priority: string): HealthTip[] => {
  return healthTips.filter(tip => tip.priority === priority);
};

export const getActionableTips = (): HealthTip[] => {
  return healthTips.filter(tip => tip.actionable);
};

export const searchHealthTips = (query: string): HealthTip[] => {
  const lowercaseQuery = query.toLowerCase();
  return healthTips.filter(tip => 
    tip.title.toLowerCase().includes(lowercaseQuery) ||
    tip.content.toLowerCase().includes(lowercaseQuery) ||
    tip.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

