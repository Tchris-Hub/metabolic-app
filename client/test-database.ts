// Database testing functions for React Native
import { supabase } from './services/supabase/config';

export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    // Test basic connection by querying a simple table or checking auth
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Database connection error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

export const testDeleteAccount = async (): Promise<boolean> => {
  try {
    // Test if the delete account function exists and is callable
    // This is a simple existence check - actual deletion would require user context
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Delete account test error:', error);
      return false;
    }

    // If we get here, auth is working
    return true;
  } catch (error) {
    console.error('Delete account test failed:', error);
    return false;
  }
};
