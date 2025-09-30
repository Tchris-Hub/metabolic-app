import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '../store/store';
import {
  signup,
  login,
  logout,
  sendVerificationEmail,
  resetPassword,
  updateUserProfile,
  checkAuthState,
  clearError,
  setUser,
  setEmailVerified,
} from '../store/slices/authSlice';
import { AuthUser, SignupData, LoginData, ProfileData } from '../services/firebase/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error, isEmailVerified } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSignup = useCallback(
    async (data: SignupData) => {
      try {
        const result = await dispatch(signup(data)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleLogin = useCallback(
    async (data: LoginData) => {
      try {
        const result = await dispatch(login(data)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleSendVerificationEmail = useCallback(async () => {
    try {
      await dispatch(sendVerificationEmail()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleResetPassword = useCallback(
    async (email: string) => {
      try {
        await dispatch(resetPassword(email)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleUpdateUserProfile = useCallback(
    async (data: ProfileData) => {
      try {
        const result = await dispatch(updateUserProfile(data)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleCheckAuthState = useCallback(async () => {
    try {
      const result = await dispatch(checkAuthState()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSetUser = useCallback(
    (user: AuthUser | null) => {
      dispatch(setUser(user));
    },
    [dispatch]
  );

  const handleSetEmailVerified = useCallback(
    (verified: boolean) => {
      dispatch(setEmailVerified(verified));
    },
    [dispatch]
  );

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    isEmailVerified,
    
    // Actions
    signup: handleSignup,
    login: handleLogin,
    logout: handleLogout,
    sendVerificationEmail: handleSendVerificationEmail,
    resetPassword: handleResetPassword,
    updateUserProfile: handleUpdateUserProfile,
    checkAuthState: handleCheckAuthState,
    clearError: handleClearError,
    setUser: handleSetUser,
    setEmailVerified: handleSetEmailVerified,
  };
};

