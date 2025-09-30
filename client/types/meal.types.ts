export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type CuisineType = 
  | 'american' 
  | 'italian' 
  | 'mexican' 
  | 'asian' 
  | 'indian' 
  | 'mediterranean' 
  | 'middle_eastern' 
  | 'other';

export type DietaryRestriction = 
  | 'vegetarian' 
  | 'vegan' 
  | 'gluten_free' 
  | 'dairy_free' 
  | 'nut_free' 
  | 'low_carb' 
  | 'low_sodium' 
  | 'diabetic_friendly';

export interface NutritionInfo {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  saturatedFat?: number;
  transFat?: number;
  potassium?: number;
  calcium?: number;
  iron?: number;
  vitaminA?: number;
  vitaminC?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  nutrition: NutritionInfo;
  notes?: string;
}

export interface Instruction {
  id: string;
  step: number;
  description: string;
  duration?: number;
  temperature?: number;
  notes?: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  type: MealType;
  cuisine: CuisineType;
  difficulty: DifficultyLevel;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  imageUrl?: string;
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  instructions: Instruction[];
  dietaryRestrictions: DietaryRestriction[];
  tags: string[];
  rating?: number;
  reviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  duration: number; // days
  meals: MealPlanDay[];
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  dietaryRestrictions: DietaryRestriction[];
  difficulty: DifficultyLevel;
  rating?: number;
  reviews?: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealPlanDay {
  day: number;
  meals: {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
    snacks?: Meal[];
  };
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  imageUrl?: string;
  nutrition: NutritionInfo;
  servingSize: number;
  servingUnit: string;
  category: string;
  subcategory?: string;
  tags: string[];
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodLog {
  id: string;
  userId: string;
  foodItem: FoodItem;
  amount: number;
  unit: string;
  mealType: MealType;
  timestamp: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FavoriteMeal {
  id: string;
  userId: string;
  meal: Meal;
  addedAt: Date;
}

export interface RecentMeal {
  id: string;
  userId: string;
  meal: Meal;
  lastEaten: Date;
  timesEaten: number;
}

export interface MealRating {
  id: string;
  userId: string;
  mealId: string;
  rating: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealSearchFilters {
  type?: MealType;
  cuisine?: CuisineType;
  difficulty?: DifficultyLevel;
  dietaryRestrictions?: DietaryRestriction[];
  maxPrepTime?: number;
  maxCookTime?: number;
  maxCalories?: number;
  maxCarbs?: number;
  minProtein?: number;
  tags?: string[];
  rating?: number;
}

export interface MealRecommendation {
  id: string;
  userId: string;
  meal: Meal;
  reason: string;
  confidence: number;
  createdAt: Date;
}

export interface MealPlanState {
  mealPlans: MealPlan[];
  currentMealPlan: MealPlan | null;
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  favoriteMeals: FavoriteMeal[];
  recentMeals: RecentMeal[];
  foodLogs: FoodLog[];
  recommendations: MealRecommendation[];
}

export interface MealContextType {
  mealPlans: MealPlan[];
  currentMealPlan: MealPlan | null;
  isLoading: boolean;
  error: string | null;
  createMealPlan: (mealPlan: Omit<MealPlan, 'id'>) => Promise<MealPlan>;
  getMealPlans: () => Promise<MealPlan[]>;
  updateMealPlan: (id: string, data: Partial<MealPlan>) => Promise<MealPlan>;
  deleteMealPlan: (id: string) => Promise<void>;
  setCurrentMealPlan: (mealPlan: MealPlan | null) => void;
  addFavoriteMeal: (meal: Meal) => Promise<void>;
  removeFavoriteMeal: (mealId: string) => Promise<void>;
  addRecentMeal: (meal: Meal) => Promise<void>;
  logFood: (foodLog: Omit<FoodLog, 'id'>) => Promise<FoodLog>;
  getFoodLogs: (date: Date) => Promise<FoodLog[]>;
  getRecommendations: () => Promise<MealRecommendation[]>;
  clearError: () => void;
}

