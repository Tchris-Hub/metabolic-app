import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DatabaseService, HealthReading } from '../../services/firebase/database';

interface HealthState {
  readings: HealthReading[];
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  bloodSugarReadings: HealthReading[];
  bloodPressureReadings: HealthReading[];
  weightReadings: HealthReading[];
  activityReadings: HealthReading[];
}

const initialState: HealthState = {
  readings: [],
  isLoading: false,
  error: null,
  lastSync: null,
  bloodSugarReadings: [],
  bloodPressureReadings: [],
  weightReadings: [],
  activityReadings: [],
};

// Async thunks
export const saveHealthReading = createAsyncThunk(
  'health/saveHealthReading',
  async (reading: Omit<HealthReading, 'id'>, { rejectWithValue }) => {
    try {
      const id = await DatabaseService.saveHealthReading(reading as HealthReading);
      return { id, ...reading };
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const getHealthReadings = createAsyncThunk(
  'health/getHealthReadings',
  async (params: { userId: string; type?: string; limit?: number }, { rejectWithValue }) => {
    try {
      const readings = await DatabaseService.getHealthReadings(
        params.userId,
        params.type,
        params.limit
      );
      return readings;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const updateHealthReading = createAsyncThunk(
  'health/updateHealthReading',
  async (params: { id: string; data: Partial<HealthReading> }, { rejectWithValue }) => {
    try {
      await DatabaseService.updateHealthReading(params.id, params.data);
      return { id: params.id, ...params.data };
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const deleteHealthReading = createAsyncThunk(
  'health/deleteHealthReading',
  async (id: string, { rejectWithValue }) => {
    try {
      await DatabaseService.deleteHealthReading(id);
      return id;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const syncHealthData = createAsyncThunk(
  'health/syncHealthData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const [bloodSugar, bloodPressure, weight, activity] = await Promise.all([
        DatabaseService.getHealthReadings(userId, 'bloodSugar', 30),
        DatabaseService.getHealthReadings(userId, 'bloodPressure', 30),
        DatabaseService.getHealthReadings(userId, 'weight', 30),
        DatabaseService.getHealthReadings(userId, 'activity', 30),
      ]);

      return {
        bloodSugar,
        bloodPressure,
        weight,
        activity,
        lastSync: new Date(),
      };
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addReading: (state, action: PayloadAction<HealthReading>) => {
      state.readings.unshift(action.payload);
      
      // Add to specific type arrays
      switch (action.payload.type) {
        case 'bloodSugar':
          state.bloodSugarReadings.unshift(action.payload);
          break;
        case 'bloodPressure':
          state.bloodPressureReadings.unshift(action.payload);
          break;
        case 'weight':
          state.weightReadings.unshift(action.payload);
          break;
        case 'activity':
          state.activityReadings.unshift(action.payload);
          break;
      }
    },
    updateReading: (state, action: PayloadAction<HealthReading>) => {
      const index = state.readings.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.readings[index] = action.payload;
      }
      
      // Update in specific type arrays
      const updateInArray = (array: HealthReading[]) => {
        const typeIndex = array.findIndex(r => r.id === action.payload.id);
        if (typeIndex !== -1) {
          array[typeIndex] = action.payload;
        }
      };
      
      switch (action.payload.type) {
        case 'bloodSugar':
          updateInArray(state.bloodSugarReadings);
          break;
        case 'bloodPressure':
          updateInArray(state.bloodPressureReadings);
          break;
        case 'weight':
          updateInArray(state.weightReadings);
          break;
        case 'activity':
          updateInArray(state.activityReadings);
          break;
      }
    },
    removeReading: (state, action: PayloadAction<string>) => {
      const reading = state.readings.find(r => r.id === action.payload);
      if (reading) {
        state.readings = state.readings.filter(r => r.id !== action.payload);
        
        // Remove from specific type arrays
        switch (reading.type) {
          case 'bloodSugar':
            state.bloodSugarReadings = state.bloodSugarReadings.filter(r => r.id !== action.payload);
            break;
          case 'bloodPressure':
            state.bloodPressureReadings = state.bloodPressureReadings.filter(r => r.id !== action.payload);
            break;
          case 'weight':
            state.weightReadings = state.weightReadings.filter(r => r.id !== action.payload);
            break;
          case 'activity':
            state.activityReadings = state.activityReadings.filter(r => r.id !== action.payload);
            break;
        }
      }
    },
    clearReadings: (state) => {
      state.readings = [];
      state.bloodSugarReadings = [];
      state.bloodPressureReadings = [];
      state.weightReadings = [];
      state.activityReadings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Save health reading
      .addCase(saveHealthReading.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveHealthReading.fulfilled, (state, action) => {
        state.isLoading = false;
        state.readings.unshift(action.payload);
        
        // Add to specific type arrays
        switch (action.payload.type) {
          case 'bloodSugar':
            state.bloodSugarReadings.unshift(action.payload);
            break;
          case 'bloodPressure':
            state.bloodPressureReadings.unshift(action.payload);
            break;
          case 'weight':
            state.weightReadings.unshift(action.payload);
            break;
          case 'activity':
            state.activityReadings.unshift(action.payload);
            break;
        }
      })
      .addCase(saveHealthReading.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get health readings
      .addCase(getHealthReadings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getHealthReadings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.readings = action.payload;
      })
      .addCase(getHealthReadings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update health reading
      .addCase(updateHealthReading.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateHealthReading.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.readings.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.readings[index] = { ...state.readings[index], ...action.payload };
        }
      })
      .addCase(updateHealthReading.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete health reading
      .addCase(deleteHealthReading.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteHealthReading.fulfilled, (state, action) => {
        state.isLoading = false;
        state.readings = state.readings.filter(r => r.id !== action.payload);
        state.bloodSugarReadings = state.bloodSugarReadings.filter(r => r.id !== action.payload);
        state.bloodPressureReadings = state.bloodPressureReadings.filter(r => r.id !== action.payload);
        state.weightReadings = state.weightReadings.filter(r => r.id !== action.payload);
        state.activityReadings = state.activityReadings.filter(r => r.id !== action.payload);
      })
      .addCase(deleteHealthReading.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sync health data
      .addCase(syncHealthData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncHealthData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bloodSugarReadings = action.payload.bloodSugar;
        state.bloodPressureReadings = action.payload.bloodPressure;
        state.weightReadings = action.payload.weight;
        state.activityReadings = action.payload.activity;
        state.lastSync = action.payload.lastSync;
      })
      .addCase(syncHealthData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, addReading, updateReading, removeReading, clearReadings } = healthSlice.actions;
export default healthSlice.reducer;

