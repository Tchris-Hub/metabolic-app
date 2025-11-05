export interface IngredientNutrition {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export class NutritionCalculator {
  /**
   * Calculate nutrition for a recipe based on ingredients
   */
  static calculateRecipeNutrition(ingredients: any[]): RecipeNutrition {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSugar = 0;
    let totalSodium = 0;

    ingredients.forEach(ingredient => {
      // Basic nutrition calculation - in real app, this would use a food database
      const amount = parseFloat(ingredient.amount) || 0;
      
      // Simple estimates based on common ingredients
      // In production, this would query a comprehensive nutrition database
      const nutrition = this.estimateIngredientNutrition(ingredient.item, amount);
      
      totalCalories += nutrition.calories;
      totalProtein += nutrition.protein;
      totalCarbs += nutrition.carbs;
      totalFat += nutrition.fat;
      totalFiber += nutrition.fiber;
      totalSugar += nutrition.sugar;
      totalSodium += nutrition.sodium;
    });

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10,
      sugar: Math.round(totalSugar * 10) / 10,
      sodium: Math.round(totalSodium),
    };
  }

  /**
   * Estimate nutrition for common ingredients
   * This is a simplified version - production would use USDA database
   */
  private static estimateIngredientNutrition(item: string, amount: number): IngredientNutrition {
    const itemLower = item.toLowerCase();
    
    // Basic estimates per 100g
    if (itemLower.includes('chicken') || itemLower.includes('poultry')) {
      return {
        name: item,
        amount,
        unit: 'g',
        calories: amount * 1.65,
        protein: amount * 0.25,
        carbs: amount * 0.01,
        fat: amount * 0.08,
        fiber: 0,
        sugar: 0,
        sodium: amount * 0.07,
      };
    }
    
    if (itemLower.includes('beef') || itemLower.includes('meat')) {
      return {
        name: item,
        amount,
        unit: 'g',
        calories: amount * 2.5,
        protein: amount * 0.26,
        carbs: 0,
        fat: amount * 0.15,
        fiber: 0,
        sugar: 0,
        sodium: amount * 0.05,
      };
    }
    
    if (itemLower.includes('salmon') || itemLower.includes('fish')) {
      return {
        name: item,
        amount,
        unit: 'g',
        calories: amount * 2.08,
        protein: amount * 0.25,
        carbs: 0,
        fat: amount * 0.12,
        fiber: 0,
        sugar: 0,
        sodium: amount * 0.04,
      };
    }
    
    if (itemLower.includes('egg')) {
      return {
        name: item,
        amount,
        unit: 'g',
        calories: amount * 1.55,
        protein: amount * 0.13,
        carbs: amount * 0.01,
        fat: amount * 0.11,
        fiber: 0,
        sugar: 0,
        sodium: amount * 0.12,
      };
    }
    
    if (itemLower.includes('avocado')) {
      return {
        name: item,
        amount,
        unit: 'g',
        calories: amount * 1.6,
        protein: amount * 0.02,
        carbs: amount * 0.09,
        fat: amount * 0.15,
        fiber: amount * 0.07,
        sugar: amount * 0.01,
        sodium: amount * 0.007,
      };
    }
    
    if (itemLower.includes('olive oil') || itemLower.includes('oil')) {
      return {
        name: item,
        amount,
        unit: 'g',
        calories: amount * 8.84,
        protein: 0,
        carbs: 0,
        fat: amount * 1,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      };
    }
    
    if (itemLower.includes('vegetable') || itemLower.includes('spinach') || itemLower.includes('lettuce')) {
      return {
        name: item,
        amount,
        unit: 'g',
        calories: amount * 0.2,
        protein: amount * 0.03,
        carbs: amount * 0.04,
        fat: amount * 0.002,
        fiber: amount * 0.02,
        sugar: amount * 0.01,
        sodium: amount * 0.08,
      };
    }
    
    if (itemLower.includes('tomato')) {
      return {
        name: item,
        amount,
        unit: 'g',
        calories: amount * 0.18,
        protein: amount * 0.009,
        carbs: amount * 0.04,
        fat: amount * 0.002,
        fiber: amount * 0.01,
        sugar: amount * 0.03,
        sodium: amount * 0.005,
      };
    }
    
    if (itemLower.includes('onion')) {
      return {
        name: item,
        amount,
        unit: 'g',
        calories: amount * 0.4,
        protein: amount * 0.01,
        carbs: amount * 0.09,
        fat: amount * 0.001,
        fiber: amount * 0.02,
        sugar: amount * 0.04,
        sodium: amount * 0.004,
      };
    }
    
    if (itemLower.includes('garlic')) {
      return {
        name: item,
        amount,
        unit: 'g',
        calories: amount * 1.49,
        protein: amount * 0.06,
        carbs: amount * 0.33,
        fat: amount * 0.005,
        fiber: amount * 0.02,
        sugar: amount * 0.01,
        sodium: amount * 0.017,
      };
    }
    
    // Default for unknown ingredients
    return {
      name: item,
      amount,
      unit: 'g',
      calories: amount * 0.5,
      protein: amount * 0.02,
      carbs: amount * 0.05,
      fat: amount * 0.01,
      fiber: amount * 0.01,
      sugar: amount * 0.02,
      sodium: amount * 0.01,
    };
  }

  /**
   * Calculate nutrition per serving
   */
  static calculatePerServing(nutrition: RecipeNutrition, servings: number): RecipeNutrition {
    return {
      calories: Math.round(nutrition.calories / servings),
      protein: Math.round((nutrition.protein / servings) * 10) / 10,
      carbs: Math.round((nutrition.carbs / servings) * 10) / 10,
      fat: Math.round((nutrition.fat / servings) * 10) / 10,
      fiber: Math.round((nutrition.fiber / servings) * 10) / 10,
      sugar: Math.round((nutrition.sugar / servings) * 10) / 10,
      sodium: Math.round(nutrition.sodium / servings),
    };
  }
}
