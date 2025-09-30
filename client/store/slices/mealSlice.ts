import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DatabaseService, MealPlan, Meal } from '../../services/firebase/database';

interface MealState {
  mealPlans: MealPlan[];
  currentMealPlan: MealPlan | null;
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  favoriteMeals: Meal[];
  recentMeals: Meal[];
}

const initialState: MealState = {
  mealPlans: [],
  currentMealPlan: null,
  isLoading: false,
  error: null,
  lastSync: null,
  favoriteMeals: [],
  recentMeals: [],
};

// Async thunks
export const saveMealPlan = createAsyncThunk(
  'meal/saveMealPlan',
  async (mealPlan: Omit<MealPlan, 'id'>, { rejectWithValue }) => {
    try {
      const id = await DatabaseService.saveMealPlan(mealPlan as MealPlan);
      return { id, ...mealPlan };
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const getMealPlans = createAsyncThunk(
  'meal/getMealPlans',
  async (userId: string, { rejectWithValue }) => {
    try {
      const mealPlans = await DatabaseService.getMealPlans(userId);
      return mealPlans;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const updateMealPlan = createAsyncThunk(
  'meal/updateMealPlan',
  async (params: { id: string; data: Partial<MealPlan> }, { rejectWithValue }) => {
    try {
      await DatabaseService.updateMealPlan(params.id, params.data);
      return { id: params.id, ...params.data };
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const deleteMealPlan = createAsyncThunk(
  'meal/deleteMealPlan',
  async (id: string, { rejectWithValue }) => {
    try {
      await DatabaseService.deleteMealPlan(id);
      return id;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const syncMealData = createAsyncThunk(
  'meal/syncMealData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const mealPlans = await DatabaseService.getMealPlans(userId);
      return {
        mealPlans,
        lastSync: new Date(),
      };
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentMealPlan: (state, action: PayloadAction<MealPlan | null>) => {
      state.currentMealPlan = action.payload;
    },
    addMealPlan: (state, action: PayloadAction<MealPlan>) => {
      state.mealPlans.unshift(action.payload);
    },
    updateMealPlanLocal: (state, action: PayloadAction<MealPlan>) => {
      const index = state.mealPlans.findIndex(mp => mp.id === action.payload.id);
      if (index !== -1) {
        state.mealPlans[index] = action.payload;
      }
      if (state.currentMealPlan?.id === action.payload.id) {
        state.currentMealPlan = action.payload;
      }
    },
    removeMealPlan: (state, action: PayloadAction<string>) => {
      state.mealPlans = state.mealPlans.filter(mp => mp.id !== action.payload);
      if (state.currentMealPlan?.id === action.payload) {
        state.currentMealPlan = null;
      }
    },
    addFavoriteMeal: (state, action: PayloadAction<Meal>) => {
      const existingIndex = state.favoriteMeals.findIndex(fm => fm.id === action.payload.id);
      if (existingIndex === -1) {
        state.favoriteMeals.unshift(action.payload);
      }
    },
    removeFavoriteMeal: (state, action: PayloadAction<string>) => {
      state.favoriteMeals = state.favoriteMeals.filter(fm => fm.id !== action.payload);
    },
    addRecentMeal: (state, action: PayloadAction<Meal>) => {
      const existingIndex = state.recentMeals.findIndex(rm => rm.id === action.payload.id);
      if (existingIndex !== -1) {
        state.recentMeals.splice(existingIndex, 1);
      }
      state.recentMeals.unshift(action.payload);
      
      // Keep only the last 10 recent meals
      if (state.recentMeals.length > 10) {
        state.recentMeals = state.recentMeals.slice(0, 10);
      }
    },
    clearMealPlans: (state) => {
      state.mealPlans = [];
      state.currentMealPlan = null;
    },
    clearFavorites: (state) => {
      state.favoriteMeals = [];
    },
    clearRecent: (state) => {
      state.recentMeals = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Save meal plan
      .addCase(saveMealPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mealPlans.unshift(action.payload);
      })
      .addCase(saveMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get meal plans
      .addCase(getMealPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMealPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mealPlans = action.payload;
      })
      .addCase(getMealPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update meal plan
      .addCase(updateMealPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.mealPlans.findIndex(mp => mp.id === action.payload.id);
        if (index !== -1) {
          state.mealPlans[index] = { ...state.mealPlans[index], ...action.payload };
        }
        if (state.currentMealPlan?.id === action.payload.id) {
          state.currentMealPlan = { ...state.currentMealPlan, ...action.payload };
        }
      })
      .addCase(updateMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete meal plan
      .addCase(deleteMealPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mealPlans = state.mealPlans.filter(mp => mp.id !== action.payload);
        if (state.currentMealPlan?.id === action.payload) {
          state.currentMealPlan = null;
        }
      })
      .addCase(deleteMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sync meal data
      .addCase(syncMealData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncMealData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mealPlans = action.payload.mealPlans;
        state.lastSync = action.payload.lastSync;
      })
      .addCase(syncMealData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentMealPlan,
  addMealPlan,
  updateMealPlanLocal,
  removeMealPlan,
  addFavoriteMeal,
  removeFavoriteMeal,
  addRecentMeal,
  clearMealPlans,
  clearFavorites,
  clearRecent,
} = mealSlice.actions;
export default mealSlice.reducer;

