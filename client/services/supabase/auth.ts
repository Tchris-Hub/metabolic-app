import { supabase } from './config';
import { AuthError, Session, User } from '@supabase/supabase-js';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
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

export class AuthService {
  /**
   * Start phone sign-in by sending SMS OTP. If the phone is new, Supabase can create the user.
   */
  static async signInWithPhone(phone: string): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          // Do not create a new auth user when sending OTP.
          // This ensures the user must already exist before an OTP can be sent.
          shouldCreateUser: false,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      throw new Error(`Failed to send OTP: ${(error as AuthError).message}`);
    }
  }

  /**
   * Verify the SMS OTP for the given phone number.
   */
  static async verifyPhoneOtp(phone: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      if (error) throw error;
      return data;
    } catch (error: unknown) {
      throw new Error(`Failed to verify OTP: ${(error as AuthError).message}`);
    }
  }
  /**
   * Sign up a new user with email and password
   * NOTE: If email confirmation is enabled, session will be null until email is verified
   */
  static async signup(data: SignupData): Promise<{ user: User; session: Session | null }> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { display_name: data.displayName },
        },
      });

      if (error) throw error;
      if (!authData.user) {
        throw new Error('Signup failed: No user returned');
      }

      // Session will be null if email confirmation is required
      return { user: authData.user, session: authData.session };
    } catch (error: unknown) {
      throw new Error(`Signup failed: ${(error as AuthError).message}`);
    }
  }

  /**
   * Sign in with email and password
   */
  static async login(data: LoginData): Promise<{ user: User; session: Session }> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      if (!authData.user || !authData.session) {
        throw new Error('Login failed: No user or session returned');
      }

      return { user: authData.user, session: authData.session };
    } catch (error: unknown) {
      throw new Error(`Login failed: ${(error as AuthError).message}`);
    }
  }

  /**
   * Sign out the current user
   */
  static async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: unknown) {
      console.error('Logout failed:', error);
      throw new Error(`Logout failed: ${(error as AuthError).message}`);
    }
  }

  /**
   * Delete the current user's account
   * This will delete all user data and sign them out
   * Note: The actual Supabase Auth user will remain but can only be fully deleted via Supabase Dashboard or Edge Function
   */
  static async deleteAccount(): Promise<void> {
    try {
      // Ensure we have a session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session?.user) throw new Error('You must be logged in to delete your account.');

      const userId = sessionData.session.user.id;
      console.log('Starting account deletion for user:', userId);

      // Delete user profile data
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .delete()
          .eq('user_id', userId);
        
        if (profileError) {
          console.warn('Failed to delete user profile:', profileError);
        } else {
          console.log('✅ User profile deleted');
        }
      } catch (err) {
        console.warn('Error deleting user profile:', err);
      }

      // Delete meal plans
      try {
        const { error: mealError } = await supabase
          .from('meal_plans')
          .delete()
          .eq('user_id', userId);
        
        if (mealError) {
          console.warn('Failed to delete meal plans:', mealError);
        } else {
          console.log('✅ Meal plans deleted');
        }
      } catch (err) {
        console.warn('Error deleting meal plans:', err);
      }

      // Delete health logs
      try {
        const { error: logsError } = await supabase
          .from('health_logs')
          .delete()
          .eq('user_id', userId);
        
        if (logsError) {
          console.warn('Failed to delete health logs:', logsError);
        } else {
          console.log('✅ Health logs deleted');
        }
      } catch (err) {
        console.warn('Error deleting health logs:', err);
      }

      console.log('✅ All user data deleted, signing out...');

      // Sign out the user
      await this.logout();

      console.log('✅ Account deletion completed');
    } catch (error: unknown) {
      console.error('Delete account failed:', error);
      const msg = (error as any)?.message || 'Unknown error';
      throw new Error(`Failed to delete account: ${msg}`);
    }
  }

  /**
   * Sign in with Google
   */
  static async signInWithGoogle(): Promise<{ url: string | null }> {
    try {
      // Build a redirect URL that matches app.json "scheme"
      // Allow override via EXPO_PUBLIC_AUTH_REDIRECT_URL
      const { default: Linking } = await import('expo-linking');
      const envRedirect = process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL;
      const redirectTo = envRedirect || Linking.createURL('auth/callback');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;

      return { url: data.url || null };
    } catch (error: unknown) {
      throw new Error(`Google sign-in failed: ${(error as AuthError).message}`);
    }
  }

  /**
   * Sign in with Apple
   */
  static async signInWithApple(): Promise<{ url: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'exp://localhost:8081', // Update with your app scheme
        },
      });

      if (error) throw error;

      return { url: data.url || null };
    } catch (error: unknown) {
      throw new Error(`Apple sign-in failed: ${(error as AuthError).message}`);
    }
  }
  /**
   * Resend confirmation email
   */
  static async resendConfirmationEmail(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
    } catch (error: unknown) {
      throw new Error(`Failed to resend confirmation email: ${(error as AuthError).message}`);
    }
  }

  /**
   * Send email verification
   */
  static async sendVerificationEmail(): Promise<void> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error('No user is currently signed in');

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });

      if (resendError) throw resendError;
    } catch (error: unknown) {
      throw new Error(`Failed to send verification email: ${(error as AuthError).message}`);
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'yourapp://reset-password',
      });

      if (error) throw error;
    } catch (error: unknown) {
      throw new Error(`Failed to send password reset email: ${(error as AuthError).message}`);
    }
  }

  /**
   * Update password (when user is logged in)
   */
  static async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error: unknown) {
      throw new Error(`Failed to update password: ${(error as AuthError).message}`);
    }
  }

  /**
   * Update user profile (metadata)
   */
  static async updateUserProfile(data: ProfileData): Promise<User> {
    try {
      const { data: userData, error } = await supabase.auth.updateUser({
        data: {
          display_name: data.displayName,
          avatar_url: data.photoURL,
        },
      });

      if (error) throw error;
      if (!userData.user) throw new Error('Failed to update profile: No user returned');

      return userData.user;
    } catch (error: unknown) {
      throw new Error(`Failed to update profile: ${(error as AuthError).message}`);
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session exists, return null (not an error - user just isn't logged in)
      if (!session) {
        return null;
      }

      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error: unknown) {
      // Don't log AuthSessionMissingError as it's expected when not logged in
      if ((error as any)?.name !== 'AuthSessionMissingError') {
        console.error('Error getting current user:', error);
      }
      return null;
    }
  }

  /**
   * Get current session
   */
  static async getSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error: unknown) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Convert Supabase User to AuthUser format
   */
  static getUserData(user: User): AuthUser {
    return {
      uid: user.id,
      email: user.email || null,
      displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || null,
      emailVerified: !!user.email_confirmed_at,
      photoURL: user.user_metadata?.avatar_url || null,
    };
  }

  /**
   * Check if email is verified
   */
  static async isEmailVerified(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user?.email_confirmed_at;
    } catch (error: unknown) {
      console.error('Error checking email verification:', error);
      return false;
    }
  }

  /**
   * Get user ID
   */
  static async getUserId(): Promise<string | null> {
    try {
      const user = await this.getCurrentUser();
      return user?.id || null;
    } catch (error: unknown) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });
  }

  /**
   * Sign in with OAuth provider (Google, Apple, etc.)
   */
  static async signInWithOAuth(provider: 'google' | 'apple' | 'facebook'): Promise<{ url: string | null }> {
    try {
      const { default: Linking } = await import('expo-linking');
      const envRedirect = process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL;
      const redirectTo = envRedirect || Linking.createURL('auth/callback');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;
      return { url: data.url || null };
    } catch (error: unknown) {
      throw new Error(`OAuth login failed: ${(error as AuthError).message}`);
    }
  }
}