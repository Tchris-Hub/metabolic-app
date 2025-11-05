import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';  // Full Supabase User type
import { AuthService } from '../services/supabase/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange((newUser) => {
      setUser(newUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: authUser } = await AuthService.login({ email, password });
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    try {
      const { user: authUser, session } = await AuthService.signup({ email, password, displayName });
      
      // Only set user if we have a session (email confirmation disabled)
      // If session is null, email confirmation is required - user must verify email first
      if (session) {
        setUser(authUser);
      } else {
        // Email confirmation required - don't set user yet
        console.log('Email confirmation required. Please check your email.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async (): Promise<string | null> => {
    try {
      const { url } = await AuthService.signInWithGoogle();
      return url;
    } catch (e) {
      console.error('Google sign-in failed', e);
      return null;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout, googleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
