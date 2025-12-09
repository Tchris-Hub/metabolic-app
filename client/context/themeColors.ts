/**
 * Theme color definitions for light and dark modes
 * Extracted to a separate file for easier testing
 */

// Professional Dark Theme Colors
export const colors = {
  light: {
    // Backgrounds
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F4F6',
    
    // Text
    text: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    
    // Borders
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    // Status
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Gradients
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
  },
  dark: {
    // Backgrounds - Professional Dark Theme (Inspired by modern apps)
    background: '#0F172A',        // Slate 900
    surface: '#1E293B',           // Slate 800
    surfaceSecondary: '#334155',  // Slate 700
    
    // Text
    text: '#F1F5F9',              // Slate 100
    textSecondary: '#CBD5E1',     // Slate 300
    textTertiary: '#94A3B8',      // Slate 400
    
    // Borders
    border: '#334155',            // Slate 700
    borderLight: '#475569',       // Slate 600
    
    // Status
    success: '#34D399',           // Emerald 400
    warning: '#FBBF24',           // Amber 400
    error: '#F87171',             // Red 400
    info: '#60A5FA',              // Blue 400
    
    // Gradients - Darker, more subtle
    gradientStart: '#4C1D95',     // Purple 900
    gradientEnd: '#581C87',       // Purple 900
  },
};

// Theme-specific gradient colors for each screen
export const gradients = {
  light: {
    home: ['#667eea', '#764ba2'],
    meal: ['#FF9800', '#F57C00'],
    log: ['#2196F3', '#1976D2'],
    learn: ['#9C27B0', '#7B1FA2'],
    more: ['#667eea', '#764ba2'],
  },
  dark: {
    home: ['#4C1D95', '#581C87'],      // Deep Purple
    meal: ['#EA580C', '#C2410C'],      // Deep Orange
    log: ['#1E40AF', '#1E3A8A'],       // Deep Blue
    learn: ['#7E22CE', '#6B21A8'],     // Deep Purple
    more: ['#4C1D95', '#581C87'],      // Deep Purple
  },
};

// Type exports
export type ThemeColors = typeof colors.light;
export type ThemeGradients = typeof gradients.light;
