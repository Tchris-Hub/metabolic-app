import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '../store/store';
import {
  saveHealthReading,
  getHealthReadings,
  updateHealthReading,
  deleteHealthReading,
  syncHealthData,
  clearError,
  addReading,
  updateReading,
  removeReading,
  clearReadings,
} from '../store/slices/healthSlice';
import { HealthReading } from '../services/supabase/repositories/HealthReadingsRepository';

export const useHealthData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    readings,
    isLoading,
    error,
    lastSync,
    bloodSugarReadings,
    bloodPressureReadings,
    weightReadings,
    activityReadings,
  } = useSelector((state: RootState) => state.health);

  const handleSaveHealthReading = useCallback(
    async (reading: Omit<HealthReading, 'id'>) => {
      try {
        const result = await dispatch(saveHealthReading(reading)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleGetHealthReadings = useCallback(
    async (params: { userId: string; type?: string; limit?: number }) => {
      try {
        const result = await dispatch(getHealthReadings(params)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleUpdateHealthReading = useCallback(
    async (params: { id: string; data: Partial<HealthReading> }) => {
      try {
        const result = await dispatch(updateHealthReading(params)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleDeleteHealthReading = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteHealthReading(id)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleSyncHealthData = useCallback(
    async (userId: string) => {
      try {
        const result = await dispatch(syncHealthData(userId)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleAddReading = useCallback(
    (reading: HealthReading) => {
      dispatch(addReading(reading));
    },
    [dispatch]
  );

  const handleUpdateReading = useCallback(
    (reading: HealthReading) => {
      dispatch(updateReading(reading));
    },
    [dispatch]
  );

  const handleRemoveReading = useCallback(
    (id: string) => {
      dispatch(removeReading(id));
    },
    [dispatch]
  );

  const handleClearReadings = useCallback(() => {
    dispatch(clearReadings());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Helper functions
  const getReadingsByType = useCallback(
    (type: 'bloodSugar' | 'bloodPressure' | 'weight' | 'activity') => {
      switch (type) {
        case 'bloodSugar':
          return bloodSugarReadings;
        case 'bloodPressure':
          return bloodPressureReadings;
        case 'weight':
          return weightReadings;
        case 'activity':
          return activityReadings;
        default:
          return [];
      }
    },
    [bloodSugarReadings, bloodPressureReadings, weightReadings, activityReadings]
  );

  const getLatestReading = useCallback(
    (type: 'bloodSugar' | 'bloodPressure' | 'weight' | 'activity') => {
      const readings = getReadingsByType(type);
      return readings.length > 0 ? readings[0] : null;
    },
    [getReadingsByType]
  );

  const getAverageReading = useCallback(
    (type: 'bloodSugar' | 'bloodPressure' | 'weight' | 'activity', days: number = 7) => {
      const readings = getReadingsByType(type);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const recentReadings = readings.filter(reading => 
        new Date(reading.timestamp) >= cutoffDate
      );
      
      if (recentReadings.length === 0) return null;
      
      const sum = recentReadings.reduce((acc, reading) => acc + reading.value, 0);
      return sum / recentReadings.length;
    },
    [getReadingsByType]
  );

  const getTrend = useCallback(
    (type: 'bloodSugar' | 'bloodPressure' | 'weight' | 'activity', days: number = 7) => {
      const readings = getReadingsByType(type);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const recentReadings = readings.filter(reading => 
        new Date(reading.timestamp) >= cutoffDate
      );
      
      if (recentReadings.length < 2) return 'stable';
      
      const firstHalf = recentReadings.slice(0, Math.floor(recentReadings.length / 2));
      const secondHalf = recentReadings.slice(Math.floor(recentReadings.length / 2));
      
      const firstAvg = firstHalf.reduce((acc, reading) => acc + reading.value, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((acc, reading) => acc + reading.value, 0) / secondHalf.length;
      
      const difference = secondAvg - firstAvg;
      const threshold = firstAvg * 0.05; // 5% threshold
      
      if (difference > threshold) return 'up';
      if (difference < -threshold) return 'down';
      return 'stable';
    },
    [getReadingsByType]
  );

  return {
    // State
    readings,
    isLoading,
    error,
    lastSync,
    bloodSugarReadings,
    bloodPressureReadings,
    weightReadings,
    activityReadings,
    
    // Actions
    saveHealthReading: handleSaveHealthReading,
    getHealthReadings: handleGetHealthReadings,
    updateHealthReading: handleUpdateHealthReading,
    deleteHealthReading: handleDeleteHealthReading,
    syncHealthData: handleSyncHealthData,
    addReading: handleAddReading,
    updateReading: handleUpdateReading,
    removeReading: handleRemoveReading,
    clearReadings: handleClearReadings,
    clearError: handleClearError,
    
    // Helper functions
    getReadingsByType,
    getLatestReading,
    getAverageReading,
    getTrend,
  };
};

