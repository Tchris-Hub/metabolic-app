// services/AuthService.ts

import { supabase } from './config';
import { User, Session } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';

// This single line is REQUIRED for Google OAuth to work in Expo
WebBrowser.maybeCompleteAuthSession();

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}

export class AuthService {
  // ─────────────────────────────────────────────────────────────
  // Email & Password
  // ─────────────────────────────────────────────────────────────
  static async signup(email: string, password: string, displayName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Signup failed');

    return { user: data.user, session: data.session };
  }

  static async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { user: data.user!, session: data.session! };
  }

  static async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // ─────────────────────────────────────────────────────────────
  // GOOGLE SIGN-IN — Fixed for Expo Go (extracts tokens manually)
  // ─────────────────────────────────────────────────────────────
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'mha://login-callback',
          skipBrowserRedirect: true, // We handle the redirect ourselves
        },
      });

      if (error) throw error;
      if (!data.url) throw new Error('No authentication URL received');

      console.log('[Google OAuth] Opening browser with URL:', data.url);

      // Open the browser and wait for the callback
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        'mha://login-callback'
      );

      console.log('[Google OAuth] Browser result:', result.type);

      if (result.type !== 'success') {
        throw new Error('Google sign-in was cancelled');
      }

      // Extract tokens from the callback URL
      const url = (result as any).url as string;
      console.log('[Google OAuth] Callback URL received');

      // Parse the URL to get tokens (they're in the hash fragment)
      const hashIndex = url.indexOf('#');
      if (hashIndex === -1) {
        throw new Error('No authentication data in callback URL');
      }

      const hashParams = new URLSearchParams(url.substring(hashIndex + 1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (!accessToken || !refreshToken) {
        // Check if there's an error in the URL
        const errorDescription = hashParams.get('error_description');
        if (errorDescription) {
          throw new Error(errorDescription);
        }
        throw new Error('Missing tokens in callback URL');
      }

      console.log('[Google OAuth] Tokens extracted, setting session...');

      // Set the session manually since detectSessionInUrl is false
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        throw sessionError;
      }

      console.log('[Google OAuth] Session set successfully!');
    } catch (err: any) {
      console.error('[Google OAuth] Error:', err.message);
      throw new Error(err.message ?? 'Google sign-in failed');
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Password Reset (deep links to your app)
  // ─────────────────────────────────────────────────────────────
  static async sendPasswordResetEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'mha://reset-password',
    });

    if (error) throw error;
  }

  // ─────────────────────────────────────────────────────────────
  // User & Session Helpers
  // ─────────────────────────────────────────────────────────────
  static async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.user ?? null;
  }

  static async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  static getUserData(user: User): AuthUser {
    return {
      uid: user.id,
      email: user.email ?? null,
      displayName:
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'User',
      emailVerified: !!user.confirmed_at,
      photoURL: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Auth State Listener (put this in App.tsx or root layout)
  // ─────────────────────────────────────────────────────────────
  static onAuthStateChange(callback: (user: User | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });

    return data.subscription;
  }
}