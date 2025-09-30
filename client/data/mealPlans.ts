export interface MealPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // days
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetConditions: string[];
  meals: {
    day: number;
    meals: {
      type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      name: string;
      description: string;
      calories: number;
      carbs: number;
      protein: number;
      fat: number;
      fiber: number;
      sodium: number;
      prepTime: number; // minutes
      ingredients: string[];
      instructions: string[];
      tags: string[];
    }[];
  }[];
}

export const mealPlans: MealPlan[] = [
  {
    id: 'diabetes-basics',
    name: 'Diabetes-Friendly Basics',
    description: 'A 7-day meal plan designed for blood sugar control',
    duration: 7,
    difficulty: 'beginner',
    targetConditions: ['diabetes', 'prediabetes'],
    meals: [
      {
        day: 1,
        meals: [
          {
            type: 'breakfast',
            name: 'Oatmeal with Berries',
            description: 'Steel-cut oats with fresh berries and nuts',
            calories: 320,
            carbs: 45,
            protein: 12,
            fat: 8,
            fiber: 8,
            sodium: 120,
            prepTime: 10,
            ingredients: ['1/2 cup steel-cut oats', '1/2 cup mixed berries', '1 tbsp chopped nuts', '1 tsp honey'],
            instructions: [
              'Cook oats according to package directions',
              'Top with berries and nuts',
              'Drizzle with honey if desired'
            ],
            tags: ['low-glycemic', 'high-fiber', 'antioxidants']
          },
          {
            type: 'lunch',
            name: 'Grilled Chicken Salad',
            description: 'Mixed greens with grilled chicken and vegetables',
            calories: 280,
            carbs: 15,
            protein: 35,
            fat: 8,
            fiber: 6,
            sodium: 180,
            prepTime: 15,
            ingredients: ['4 oz grilled chicken breast', '2 cups mixed greens', '1/2 cucumber', '1/4 avocado', '2 tbsp olive oil vinaigrette'],
            instructions: [
              'Grill chicken breast until cooked through',
              'Slice chicken and arrange over mixed greens',
              'Add sliced cucumber and avocado',
              'Drizzle with vinaigrette'
            ],
            tags: ['high-protein', 'low-carb', 'healthy-fats']
          },
          {
            type: 'dinner',
            name: 'Baked Salmon with Vegetables',
            description: 'Salmon fillet with roasted vegetables',
            calories: 350,
            carbs: 20,
            protein: 40,
            fat: 12,
            fiber: 8,
            sodium: 200,
            prepTime: 25,
            ingredients: ['6 oz salmon fillet', '1 cup mixed vegetables', '1 tbsp olive oil', 'Herbs and spices'],
            instructions: [
              'Preheat oven to 400°F',
              'Season salmon with herbs and spices',
              'Arrange vegetables on baking sheet',
              'Bake for 15-20 minutes until fish flakes easily'
            ],
            tags: ['omega-3', 'high-protein', 'low-carb']
          }
        ]
      }
    ]
  },
  {
    id: 'heart-healthy',
    name: 'Heart-Healthy Mediterranean',
    description: 'Mediterranean-inspired meals for cardiovascular health',
    duration: 7,
    difficulty: 'intermediate',
    targetConditions: ['hypertension', 'high-cholesterol', 'heart-disease'],
    meals: [
      {
        day: 1,
        meals: [
          {
            type: 'breakfast',
            name: 'Greek Yogurt Parfait',
            description: 'Greek yogurt with nuts and fruits',
            calories: 250,
            carbs: 20,
            protein: 18,
            fat: 12,
            fiber: 4,
            sodium: 80,
            prepTime: 5,
            ingredients: ['1 cup Greek yogurt', '1/4 cup mixed nuts', '1/2 cup berries', '1 tsp honey'],
            instructions: [
              'Layer yogurt in a glass',
              'Add berries and nuts',
              'Drizzle with honey'
            ],
            tags: ['probiotics', 'healthy-fats', 'antioxidants']
          }
        ]
      }
    ]
  }
];

export const getMealPlanById = (id: string): MealPlan | undefined => {
  return mealPlans.find(plan => plan.id === id);
};

export const getMealPlansByCondition = (condition: string): MealPlan[] => {
  return mealPlans.filter(plan => 
    plan.targetConditions.includes(condition.toLowerCase())
  );
};

