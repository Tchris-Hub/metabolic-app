export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  subcategory: string;
  servingSize: string;
  servingSizeGrams: number;
  nutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    cholesterol: number;
    saturatedFat: number;
    transFat: number;
    potassium: number;
    calcium: number;
    iron: number;
    vitaminA: number;
    vitaminC: number;
  };
  glycemicIndex?: number;
  glycemicLoad?: number;
  tags: string[];
  allergens: string[];
  isProcessed: boolean;
  isOrganic: boolean;
  isGlutenFree: boolean;
  isVegan: boolean;
  isVegetarian: boolean;
  isDiabeticFriendly: boolean;
  isHeartHealthy: boolean;
  isLowSodium: boolean;
  isLowCarb: boolean;
  isHighFiber: boolean;
  isHighProtein: boolean;
  lastUpdated: string;
  source: string;
}

export const foodDatabase: FoodItem[] = [
  {
    id: 'apple-red-delicious',
    name: 'Red Delicious Apple',
    category: 'Fruits',
    subcategory: 'Apples',
    servingSize: '1 medium (182g)',
    servingSizeGrams: 182,
    nutrition: {
      calories: 95,
      protein: 0.5,
      carbohydrates: 25,
      fat: 0.3,
      fiber: 4,
      sugar: 19,
      sodium: 2,
      cholesterol: 0,
      saturatedFat: 0.1,
      transFat: 0,
      potassium: 195,
      calcium: 11,
      iron: 0.2,
      vitaminA: 5,
      vitaminC: 8
    },
    glycemicIndex: 36,
    glycemicLoad: 9,
    tags: ['fruit', 'apple', 'fiber', 'vitamin-c'],
    allergens: [],
    isProcessed: false,
    isOrganic: false,
    isGlutenFree: true,
    isVegan: true,
    isVegetarian: true,
    isDiabeticFriendly: true,
    isHeartHealthy: true,
    isLowSodium: true,
    isLowCarb: false,
    isHighFiber: true,
    isHighProtein: false,
    lastUpdated: '2024-01-15',
    source: 'USDA FoodData Central'
  },
  {
    id: 'chicken-breast-skinless',
    name: 'Skinless Chicken Breast',
    category: 'Protein',
    subcategory: 'Poultry',
    servingSize: '3 oz (85g)',
    servingSizeGrams: 85,
    nutrition: {
      calories: 140,
      protein: 26,
      carbohydrates: 0,
      fat: 3,
      fiber: 0,
      sugar: 0,
      sodium: 60,
      cholesterol: 70,
      saturatedFat: 1,
      transFat: 0,
      potassium: 220,
      calcium: 15,
      iron: 0.7,
      vitaminA: 0,
      vitaminC: 0
    },
    tags: ['chicken', 'protein', 'lean-meat', 'low-fat'],
    allergens: [],
    isProcessed: false,
    isOrganic: false,
    isGlutenFree: true,
    isVegan: false,
    isVegetarian: false,
    isDiabeticFriendly: true,
    isHeartHealthy: true,
    isLowSodium: true,
    isLowCarb: true,
    isHighFiber: false,
    isHighProtein: true,
    lastUpdated: '2024-01-15',
    source: 'USDA FoodData Central'
  },
  {
    id: 'quinoa-cooked',
    name: 'Cooked Quinoa',
    category: 'Grains',
    subcategory: 'Ancient Grains',
    servingSize: '1 cup (185g)',
    servingSizeGrams: 185,
    nutrition: {
      calories: 222,
      protein: 8,
      carbohydrates: 39,
      fat: 4,
      fiber: 5,
      sugar: 2,
      sodium: 13,
      cholesterol: 0,
      saturatedFat: 0.5,
      transFat: 0,
      potassium: 318,
      calcium: 31,
      iron: 2.8,
      vitaminA: 0,
      vitaminC: 0
    },
    glycemicIndex: 53,
    glycemicLoad: 21,
    tags: ['quinoa', 'grain', 'protein', 'fiber', 'gluten-free'],
    allergens: [],
    isProcessed: false,
    isOrganic: false,
    isGlutenFree: true,
    isVegan: true,
    isVegetarian: true,
    isDiabeticFriendly: true,
    isHeartHealthy: true,
    isLowSodium: true,
    isLowCarb: false,
    isHighFiber: true,
    isHighProtein: true,
    lastUpdated: '2024-01-15',
    source: 'USDA FoodData Central'
  },
  {
    id: 'broccoli-raw',
    name: 'Raw Broccoli',
    category: 'Vegetables',
    subcategory: 'Cruciferous',
    servingSize: '1 cup (91g)',
    servingSizeGrams: 91,
    nutrition: {
      calories: 31,
      protein: 3,
      carbohydrates: 6,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5,
      sodium: 33,
      cholesterol: 0,
      saturatedFat: 0.1,
      transFat: 0,
      potassium: 288,
      calcium: 43,
      iron: 0.7,
      vitaminA: 31,
      vitaminC: 81
    },
    tags: ['broccoli', 'vegetable', 'vitamin-c', 'fiber', 'cruciferous'],
    allergens: [],
    isProcessed: false,
    isOrganic: false,
    isGlutenFree: true,
    isVegan: true,
    isVegetarian: true,
    isDiabeticFriendly: true,
    isHeartHealthy: true,
    isLowSodium: true,
    isLowCarb: true,
    isHighFiber: true,
    isHighProtein: false,
    lastUpdated: '2024-01-15',
    source: 'USDA FoodData Central'
  },
  {
    id: 'avocado-hass',
    name: 'Hass Avocado',
    category: 'Fruits',
    subcategory: 'Tropical',
    servingSize: '1/2 medium (68g)',
    servingSizeGrams: 68,
    nutrition: {
      calories: 114,
      protein: 1.3,
      carbohydrates: 6,
      fat: 10.5,
      fiber: 4.6,
      sugar: 0.4,
      sodium: 5,
      cholesterol: 0,
      saturatedFat: 1.5,
      transFat: 0,
      potassium: 345,
      calcium: 6,
      iron: 0.3,
      vitaminA: 2,
      vitaminC: 6
    },
    glycemicIndex: 15,
    glycemicLoad: 1,
    tags: ['avocado', 'fruit', 'healthy-fats', 'fiber', 'potassium'],
    allergens: [],
    isProcessed: false,
    isOrganic: false,
    isGlutenFree: true,
    isVegan: true,
    isVegetarian: true,
    isDiabeticFriendly: true,
    isHeartHealthy: true,
    isLowSodium: true,
    isLowCarb: true,
    isHighFiber: true,
    isHighProtein: false,
    lastUpdated: '2024-01-15',
    source: 'USDA FoodData Central'
  },
  {
    id: 'salmon-atlantic-farmed',
    name: 'Atlantic Salmon (Farmed)',
    category: 'Protein',
    subcategory: 'Fish',
    servingSize: '3 oz (85g)',
    servingSizeGrams: 85,
    nutrition: {
      calories: 175,
      protein: 25,
      carbohydrates: 0,
      fat: 8,
      fiber: 0,
      sugar: 0,
      sodium: 50,
      cholesterol: 55,
      saturatedFat: 1.5,
      transFat: 0,
      potassium: 350,
      calcium: 15,
      iron: 0.7,
      vitaminA: 0,
      vitaminC: 0
    },
    tags: ['salmon', 'fish', 'omega-3', 'protein', 'seafood'],
    allergens: ['fish'],
    isProcessed: false,
    isOrganic: false,
    isGlutenFree: true,
    isVegan: false,
    isVegetarian: false,
    isDiabeticFriendly: true,
    isHeartHealthy: true,
    isLowSodium: true,
    isLowCarb: true,
    isHighFiber: false,
    isHighProtein: true,
    lastUpdated: '2024-01-15',
    source: 'USDA FoodData Central'
  },
  {
    id: 'brown-rice-cooked',
    name: 'Cooked Brown Rice',
    category: 'Grains',
    subcategory: 'Rice',
    servingSize: '1 cup (195g)',
    servingSizeGrams: 195,
    nutrition: {
      calories: 218,
      protein: 5,
      carbohydrates: 46,
      fat: 1.8,
      fiber: 3.5,
      sugar: 0.7,
      sodium: 2,
      cholesterol: 0,
      saturatedFat: 0.4,
      transFat: 0,
      potassium: 84,
      calcium: 20,
      iron: 1,
      vitaminA: 0,
      vitaminC: 0
    },
    glycemicIndex: 68,
    glycemicLoad: 31,
    tags: ['rice', 'brown-rice', 'grain', 'fiber', 'whole-grain'],
    allergens: [],
    isProcessed: false,
    isOrganic: false,
    isGlutenFree: true,
    isVegan: true,
    isVegetarian: true,
    isDiabeticFriendly: true,
    isHeartHealthy: true,
    isLowSodium: true,
    isLowCarb: false,
    isHighFiber: true,
    isHighProtein: false,
    lastUpdated: '2024-01-15',
    source: 'USDA FoodData Central'
  },
  {
    id: 'greek-yogurt-plain',
    name: 'Plain Greek Yogurt',
    category: 'Dairy',
    subcategory: 'Yogurt',
    servingSize: '1 cup (170g)',
    servingSizeGrams: 170,
    nutrition: {
      calories: 100,
      protein: 17,
      carbohydrates: 6,
      fat: 0,
      fiber: 0,
      sugar: 6,
      sodium: 50,
      cholesterol: 10,
      saturatedFat: 0,
      transFat: 0,
      potassium: 200,
      calcium: 200,
      iron: 0,
      vitaminA: 0,
      vitaminC: 0
    },
    tags: ['yogurt', 'greek-yogurt', 'protein', 'probiotics', 'dairy'],
    allergens: ['milk'],
    isProcessed: false,
    isOrganic: false,
    isGlutenFree: true,
    isVegan: false,
    isVegetarian: true,
    isDiabeticFriendly: true,
    isHeartHealthy: true,
    isLowSodium: true,
    isLowCarb: true,
    isHighFiber: false,
    isHighProtein: true,
    lastUpdated: '2024-01-15',
    source: 'USDA FoodData Central'
  }
];

export const getFoodItemById = (id: string): FoodItem | undefined => {
  return foodDatabase.find(item => item.id === id);
};

export const getFoodItemsByCategory = (category: string): FoodItem[] => {
  return foodDatabase.filter(item => item.category === category);
};

export const getFoodItemsBySubcategory = (subcategory: string): FoodItem[] => {
  return foodDatabase.filter(item => item.subcategory === subcategory);
};

export const getFoodItemsByTag = (tag: string): FoodItem[] => {
  return foodDatabase.filter(item => item.tags.includes(tag));
};

export const getDiabeticFriendlyFoods = (): FoodItem[] => {
  return foodDatabase.filter(item => item.isDiabeticFriendly);
};

export const getHeartHealthyFoods = (): FoodItem[] => {
  return foodDatabase.filter(item => item.isHeartHealthy);
};

export const getLowCarbFoods = (): FoodItem[] => {
  return foodDatabase.filter(item => item.isLowCarb);
};

export const getHighFiberFoods = (): FoodItem[] => {
  return foodDatabase.filter(item => item.isHighFiber);
};

export const getHighProteinFoods = (): FoodItem[] => {
  return foodDatabase.filter(item => item.isHighProtein);
};

export const searchFoodItems = (query: string): FoodItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return foodDatabase.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery) ||
    item.subcategory.toLowerCase().includes(lowercaseQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getFoodItemsByNutritionalCriteria = (criteria: {
  maxCalories?: number;
  minProtein?: number;
  maxCarbs?: number;
  maxFat?: number;
  minFiber?: number;
  maxSodium?: number;
}): FoodItem[] => {
  return foodDatabase.filter(item => {
    const nutrition = item.nutrition;
    
    if (criteria.maxCalories && nutrition.calories > criteria.maxCalories) return false;
    if (criteria.minProtein && nutrition.protein < criteria.minProtein) return false;
    if (criteria.maxCarbs && nutrition.carbohydrates > criteria.maxCarbs) return false;
    if (criteria.maxFat && nutrition.fat > criteria.maxFat) return false;
    if (criteria.minFiber && nutrition.fiber < criteria.minFiber) return false;
    if (criteria.maxSodium && nutrition.sodium > criteria.maxSodium) return false;
    
    return true;
  });
};

