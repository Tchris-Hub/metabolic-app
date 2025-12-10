export interface Recipe {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image: string; // emoji fallback
  imageUrl?: string; // actual image URL
  prepTime: number; // in minutes
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  ingredients: {
    item: string;
    amount: string;
  }[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  description: string;
}

export const lowCarbRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Avocado & Egg Breakfast Bowl',
    category: 'breakfast',
    image: '🥑',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop&q=60',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    difficulty: 'easy',
    tags: ['low-carb', 'high-protein', 'keto', 'quick'],
    ingredients: [
      { item: 'Avocado', amount: '1 medium' },
      { item: 'Eggs', amount: '2 large' },
      { item: 'Cherry tomatoes', amount: '5-6' },
      { item: 'Feta cheese', amount: '2 tbsp' },
      { item: 'Olive oil', amount: '1 tsp' },
      { item: 'Salt and pepper', amount: 'to taste' },
    ],
    instructions: [
      'Cut avocado in half and remove pit',
      'Scoop out some flesh to make room for egg',
      'Crack an egg into each avocado half',
      'Season with salt and pepper',
      'Bake at 425°F for 15-20 minutes',
      'Top with cherry tomatoes and feta',
      'Drizzle with olive oil and serve',
    ],
    nutrition: {
      calories: 380,
      protein: 18,
      carbs: 12,
      fat: 28,
      fiber: 9,
      sugar: 2,
    },
    description: 'A delicious and filling low-carb breakfast packed with healthy fats and protein.',
  },
  {
    id: '2',
    name: 'Grilled Chicken Caesar Salad',
    category: 'lunch',
    image: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&auto=format&fit=crop&q=60',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: 'easy',
    tags: ['low-carb', 'high-protein', 'gluten-free'],
    ingredients: [
      { item: 'Chicken breast', amount: '2 pieces (6 oz each)' },
      { item: 'Romaine lettuce', amount: '1 head' },
      { item: 'Parmesan cheese', amount: '1/4 cup shaved' },
      { item: 'Caesar dressing', amount: '3 tbsp' },
      { item: 'Olive oil', amount: '1 tbsp' },
      { item: 'Lemon juice', amount: '1 tbsp' },
      { item: 'Garlic powder', amount: '1 tsp' },
    ],
    instructions: [
      'Season chicken with garlic powder, salt, and pepper',
      'Grill chicken for 6-7 minutes per side',
      'Let chicken rest for 5 minutes, then slice',
      'Wash and chop romaine lettuce',
      'Toss lettuce with Caesar dressing',
      'Top with sliced chicken and parmesan',
      'Drizzle with lemon juice and serve',
    ],
    nutrition: {
      calories: 420,
      protein: 45,
      carbs: 8,
      fat: 22,
      fiber: 3,
      sugar: 2,
    },
    description: 'Classic Caesar salad with perfectly grilled chicken - a protein-packed lunch option.',
  },
  {
    id: '3',
    name: 'Zucchini Noodles with Pesto',
    category: 'dinner',
    image: '🍝',
    imageUrl: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&auto=format&fit=crop&q=60',
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: 'easy',
    tags: ['low-carb', 'vegetarian', 'keto', 'quick'],
    ingredients: [
      { item: 'Zucchini', amount: '3 medium' },
      { item: 'Basil pesto', amount: '1/4 cup' },
      { item: 'Cherry tomatoes', amount: '1 cup halved' },
      { item: 'Parmesan cheese', amount: '1/4 cup grated' },
      { item: 'Pine nuts', amount: '2 tbsp' },
      { item: 'Olive oil', amount: '1 tbsp' },
      { item: 'Garlic', amount: '2 cloves minced' },
    ],
    instructions: [
      'Spiralize zucchini into noodles',
      'Heat olive oil in a large pan',
      'Sauté garlic for 30 seconds',
      'Add zucchini noodles and cook for 3-4 minutes',
      'Toss with pesto and cherry tomatoes',
      'Top with parmesan and pine nuts',
      'Serve immediately while warm',
    ],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 15,
      fat: 24,
      fiber: 5,
      sugar: 8,
    },
    description: 'A light and flavorful low-carb pasta alternative that\'s ready in 20 minutes.',
  },
  {
    id: '4',
    name: 'Salmon with Asparagus',
    category: 'dinner',
    image: '🐟',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&auto=format&fit=crop&q=60',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    difficulty: 'medium',
    tags: ['low-carb', 'high-protein', 'omega-3', 'heart-healthy'],
    ingredients: [
      { item: 'Salmon fillets', amount: '2 pieces (6 oz each)' },
      { item: 'Asparagus', amount: '1 lb' },
      { item: 'Lemon', amount: '1' },
      { item: 'Garlic', amount: '3 cloves minced' },
      { item: 'Olive oil', amount: '2 tbsp' },
      { item: 'Dill', amount: '2 tbsp fresh' },
      { item: 'Salt and pepper', amount: 'to taste' },
    ],
    instructions: [
      'Preheat oven to 400°F',
      'Place salmon and asparagus on baking sheet',
      'Drizzle with olive oil and season',
      'Top salmon with garlic and dill',
      'Squeeze lemon juice over everything',
      'Bake for 15-18 minutes',
      'Serve with lemon wedges',
    ],
    nutrition: {
      calories: 450,
      protein: 42,
      carbs: 10,
      fat: 26,
      fiber: 4,
      sugar: 3,
    },
    description: 'Omega-3 rich salmon paired with tender asparagus - a perfect heart-healthy dinner.',
  },
  {
    id: '5',
    name: 'Greek Yogurt Parfait',
    category: 'breakfast',
    image: '🥄',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=60',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: 'easy',
    tags: ['low-carb', 'high-protein', 'quick', 'no-cook'],
    ingredients: [
      { item: 'Greek yogurt', amount: '1 cup plain' },
      { item: 'Berries', amount: '1/2 cup mixed' },
      { item: 'Almonds', amount: '2 tbsp sliced' },
      { item: 'Chia seeds', amount: '1 tbsp' },
      { item: 'Cinnamon', amount: '1/2 tsp' },
      { item: 'Stevia', amount: 'optional' },
    ],
    instructions: [
      'Layer Greek yogurt in a bowl or glass',
      'Add a layer of mixed berries',
      'Sprinkle with sliced almonds',
      'Add chia seeds on top',
      'Dust with cinnamon',
      'Add stevia if desired for sweetness',
      'Enjoy immediately',
    ],
    nutrition: {
      calories: 280,
      protein: 22,
      carbs: 18,
      fat: 14,
      fiber: 6,
      sugar: 10,
    },
    description: 'A quick and nutritious breakfast packed with protein and antioxidants.',
  },
  {
    id: '6',
    name: 'Cauliflower Fried Rice',
    category: 'dinner',
    image: '🍚',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=60',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    tags: ['low-carb', 'vegetarian', 'asian-inspired', 'meal-prep'],
    ingredients: [
      { item: 'Cauliflower', amount: '1 large head' },
      { item: 'Eggs', amount: '2' },
      { item: 'Mixed vegetables', amount: '2 cups' },
      { item: 'Soy sauce', amount: '3 tbsp' },
      { item: 'Sesame oil', amount: '1 tbsp' },
      { item: 'Garlic', amount: '3 cloves minced' },
      { item: 'Green onions', amount: '3 chopped' },
    ],
    instructions: [
      'Rice cauliflower in food processor',
      'Scramble eggs in a large wok',
      'Remove eggs and set aside',
      'Stir-fry vegetables in sesame oil',
      'Add garlic and cauliflower rice',
      'Cook for 5-7 minutes',
      'Add soy sauce, eggs, and green onions',
      'Toss everything together and serve',
    ],
    nutrition: {
      calories: 180,
      protein: 10,
      carbs: 14,
      fat: 9,
      fiber: 5,
      sugar: 6,
    },
    description: 'A low-carb twist on classic fried rice that\'s just as satisfying.',
  },
];

export const getRecipesByCategory = (category: Recipe['category']) => {
  return lowCarbRecipes.filter(recipe => recipe.category === category);
};

export const getRecipesByTags = (tags: string[]) => {
  return lowCarbRecipes.filter(recipe =>
    tags.some(tag => recipe.tags.includes(tag))
  );
};

export const searchRecipes = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return lowCarbRecipes.filter(recipe =>
    recipe.name.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
