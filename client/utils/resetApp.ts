import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/supabase/auth';
import { store } from '../store/store';
import { resetAllSettings } from '../store/slices/settingsSlice';

export type ResetAppOptions = {
  /**
   * When true, also clears onboarding flags so the app shows onboarding again on next launch.
   * When false (default), preserves onboarding flags if they previously existed.
   */
  clearOnboarding?: boolean;
};

/**
 * Clears local app data and signs out from Supabase.
 *
 * By default preserves onboarding flags so the user doesn't have to redo onboarding
 * unless you explicitly set clearOnboarding: true.
 */
export async function resetApp(options: ResetAppOptions = {}): Promise<void> {
  const { clearOnboarding = false } = options;

  // Track values we might want to preserve
  let hasSeenOnboarding: string | null = null;
  let onboardingComplete: string | null = null;

  try {
    // Read current onboarding flags BEFORE clearing storage so we can optionally restore them
    try {
      hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
    } catch {}
    try {
      onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
    } catch {}

    // Sign out user session (ignore error to keep reset moving)
    try {
      await AuthService.logout();
    } catch (e) {
      console.warn('resetApp: logout failed (continuing):', e);
    }

    // Clear all local storage
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn('resetApp: AsyncStorage.clear failed:', e);
    }

    // Optionally preserve onboarding flags
    if (!clearOnboarding) {
      try {
        if (hasSeenOnboarding === 'true') {
          await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        }
        if (onboardingComplete === 'true') {
          await AsyncStorage.setItem('onboardingComplete', 'true');
        }
      } catch (e) {
        console.warn('resetApp: failed to restore onboarding flags:', e);
      }
    }

    // Reset in-memory state where applicable
    try {
      store.dispatch(resetAllSettings());
    } catch (e) {
      // If store isn't initialized in this environment, ignore
      console.warn('resetApp: failed to dispatch settings reset (continuing):', e);
    }
  } catch (error) {
    // Surface one last error if anything unexpected bubbled up
    console.error('resetApp failed:', error);
    throw error;
  }
}
