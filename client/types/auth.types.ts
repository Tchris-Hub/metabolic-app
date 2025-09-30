export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isEmailVerified: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileData {
  displayName?: string;
  photoURL?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  country: string;
  healthConditions: string[];
  medications: string[];
  goals: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: AuthError;
}

export interface VerificationData {
  email: string;
  code: string;
}

export interface PasswordResetData {
  email: string;
  newPassword: string;
  code: string;
}

export interface SocialLoginData {
  provider: 'google' | 'apple' | 'facebook';
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signup: (data: SignupData) => Promise<User>;
  login: (data: LoginData) => Promise<User>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: ProfileData) => Promise<User>;
  clearError: () => void;
}

