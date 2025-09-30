export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
    sodium: number;
    sugar: number;
  };
  ingredients: {
    name: string;
    amount: string;
    unit: string;
  }[];
  instructions: string[];
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  rating: number;
  reviews: number;
}

export const recipes: Recipe[] = [
  {
    id: 'quinoa-bowl',
    name: 'Mediterranean Quinoa Bowl',
    description: 'A nutritious bowl packed with vegetables and healthy fats',
    category: 'lunch',
    cuisine: 'Mediterranean',
    difficulty: 'easy',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    nutrition: {
      calories: 320,
      carbs: 45,
      protein: 12,
      fat: 10,
      fiber: 8,
      sodium: 180,
      sugar: 6
    },
    ingredients: [
      { name: 'Quinoa', amount: '1', unit: 'cup' },
      { name: 'Cherry tomatoes', amount: '1', unit: 'cup' },
      { name: 'Cucumber', amount: '1', unit: 'medium' },
      { name: 'Red onion', amount: '1/4', unit: 'cup' },
      { name: 'Feta cheese', amount: '2', unit: 'oz' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
      { name: 'Lemon juice', amount: '1', unit: 'tbsp' },
      { name: 'Fresh herbs', amount: '2', unit: 'tbsp' }
    ],
    instructions: [
      'Cook quinoa according to package directions and let cool',
      'Dice cucumber and slice cherry tomatoes in half',
      'Thinly slice red onion',
      'In a large bowl, combine quinoa, vegetables, and feta',
      'Whisk together olive oil and lemon juice',
      'Pour dressing over salad and toss gently',
      'Garnish with fresh herbs and serve'
    ],
    tags: ['vegetarian', 'gluten-free', 'high-fiber', 'mediterranean'],
    rating: 4.5,
    reviews: 128
  },
  {
    id: 'baked-salmon',
    name: 'Herb-Crusted Baked Salmon',
    description: 'Tender salmon with a crispy herb crust',
    category: 'dinner',
    cuisine: 'American',
    difficulty: 'easy',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    nutrition: {
      calories: 280,
      carbs: 2,
      protein: 35,
      fat: 14,
      fiber: 0,
      sodium: 200,
      sugar: 1
    },
    ingredients: [
      { name: 'Salmon fillets', amount: '4', unit: '6-oz pieces' },
      { name: 'Fresh dill', amount: '2', unit: 'tbsp' },
      { name: 'Fresh parsley', amount: '2', unit: 'tbsp' },
      { name: 'Lemon zest', amount: '1', unit: 'tsp' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
      { name: 'Salt', amount: '1/2', unit: 'tsp' },
      { name: 'Black pepper', amount: '1/4', unit: 'tsp' }
    ],
    instructions: [
      'Preheat oven to 425°F',
      'Line baking sheet with parchment paper',
      'Pat salmon fillets dry with paper towels',
      'Mix herbs, lemon zest, salt, and pepper in a small bowl',
      'Brush salmon with olive oil',
      'Press herb mixture onto salmon fillets',
      'Bake for 12-15 minutes until fish flakes easily',
      'Serve immediately'
    ],
    tags: ['high-protein', 'omega-3', 'low-carb', 'gluten-free'],
    rating: 4.7,
    reviews: 89
  },
  {
    id: 'chia-pudding',
    name: 'Chocolate Chia Pudding',
    description: 'Creamy chia pudding with cocoa and berries',
    category: 'breakfast',
    cuisine: 'International',
    difficulty: 'easy',
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    nutrition: {
      calories: 180,
      carbs: 15,
      protein: 8,
      fat: 10,
      fiber: 12,
      sodium: 50,
      sugar: 8
    },
    ingredients: [
      { name: 'Chia seeds', amount: '1/4', unit: 'cup' },
      { name: 'Almond milk', amount: '1', unit: 'cup' },
      { name: 'Cocoa powder', amount: '2', unit: 'tbsp' },
      { name: 'Honey', amount: '2', unit: 'tbsp' },
      { name: 'Vanilla extract', amount: '1', unit: 'tsp' },
      { name: 'Fresh berries', amount: '1/2', unit: 'cup' }
    ],
    instructions: [
      'Whisk together almond milk, cocoa powder, honey, and vanilla',
      'Stir in chia seeds',
      'Cover and refrigerate for at least 4 hours or overnight',
      'Stir well before serving',
      'Top with fresh berries'
    ],
    tags: ['vegan', 'gluten-free', 'high-fiber', 'antioxidants'],
    rating: 4.3,
    reviews: 156
  }
];

export const getRecipeById = (id: string): Recipe | undefined => {
  return recipes.find(recipe => recipe.id === id);
};

export const getRecipesByCategory = (category: string): Recipe[] => {
  return recipes.filter(recipe => recipe.category === category);
};

export const getRecipesByTag = (tag: string): Recipe[] => {
  return recipes.filter(recipe => recipe.tags.includes(tag));
};

export const searchRecipes = (query: string): Recipe[] => {
  const lowercaseQuery = query.toLowerCase();
  return recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

