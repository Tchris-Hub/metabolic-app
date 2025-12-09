import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors, gradients } from './themeColors';

// Re-export colors and gradients for backward compatibility
export { colors, gradients };

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof colors.light;
  gradients: typeof gradients.light;
  followSystem: boolean;
  setFollowSystemPreference: (follow: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [followSystem, setFollowSystem] = useState(true);

  // Auto-switch theme based on system preference when followSystem is enabled
  useEffect(() => {
    if (followSystem && systemColorScheme !== null) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, followSystem]);

  const toggleTheme = () => {
    // When user manually toggles, disable follow system
    setFollowSystem(false);
    setIsDarkMode(prev => !prev);
  };

  // Allow user to re-enable system preference following
  const setFollowSystemPreference = (follow: boolean) => {
    setFollowSystem(follow);
    if (follow && systemColorScheme !== null) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;
  const currentGradients = isDarkMode ? gradients.dark : gradients.light;

  const value = {
    isDarkMode,
    toggleTheme,
    colors: currentColors,
    gradients: currentGradients,
    followSystem,
    setFollowSystemPreference,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
