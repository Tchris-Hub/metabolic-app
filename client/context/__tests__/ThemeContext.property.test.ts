import * as fc from 'fast-check';
import { colors, gradients } from '../themeColors';

/**
 * **Feature: ui-ux-modernization, Property 7: Theme Color Consistency**
 * **Validates: Requirements 7.1**
 * 
 * For any theme mode (dark or light), all color values in the theme 
 * SHALL be valid hex color strings or rgba values.
 */
describe('Property 7: Theme Color Consistency', () => {
  // Regex patterns for valid color formats
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbaColorRegex = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+))?\s*\)$/;
  
  const isValidColor = (color: string): boolean => {
    return hexColorRegex.test(color) || rgbaColorRegex.test(color);
  };

  it('should have all light theme colors as valid hex or rgba values', () => {
    const lightColors = colors.light;
    
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(lightColors) as (keyof typeof lightColors)[]),
        (colorKey) => {
          const colorValue = lightColors[colorKey];
          return isValidColor(colorValue);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have all dark theme colors as valid hex or rgba values', () => {
    const darkColors = colors.dark;
    
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(darkColors) as (keyof typeof darkColors)[]),
        (colorKey) => {
          const colorValue = darkColors[colorKey];
          return isValidColor(colorValue);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have matching color keys in both light and dark themes', () => {
    const lightKeys = Object.keys(colors.light).sort();
    const darkKeys = Object.keys(colors.dark).sort();
    
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          return JSON.stringify(lightKeys) === JSON.stringify(darkKeys);
        }
      ),
      { numRuns: 1 }
    );
  });

  it('should have all gradient colors as valid hex values', () => {
    const allGradientColors: string[] = [];
    
    // Collect all gradient colors from light theme
    Object.values(gradients.light).forEach(gradientArray => {
      allGradientColors.push(...gradientArray);
    });
    
    // Collect all gradient colors from dark theme
    Object.values(gradients.dark).forEach(gradientArray => {
      allGradientColors.push(...gradientArray);
    });
    
    fc.assert(
      fc.property(
        fc.constantFrom(...allGradientColors),
        (color) => {
          return isValidColor(color);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have matching gradient keys in both light and dark themes', () => {
    const lightGradientKeys = Object.keys(gradients.light).sort();
    const darkGradientKeys = Object.keys(gradients.dark).sort();
    
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          return JSON.stringify(lightGradientKeys) === JSON.stringify(darkGradientKeys);
        }
      ),
      { numRuns: 1 }
    );
  });

  it('should have each gradient contain exactly 2 colors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(gradients.light) as (keyof typeof gradients.light)[]),
        (gradientKey) => {
          const lightGradient = gradients.light[gradientKey];
          const darkGradient = gradients.dark[gradientKey];
          return lightGradient.length === 2 && darkGradient.length === 2;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have non-empty color values for all theme colors', () => {
    const allColors = [...Object.values(colors.light), ...Object.values(colors.dark)];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...allColors),
        (color) => {
          return color.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have distinct background and surface colors for visual hierarchy', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light', 'dark') as fc.Arbitrary<'light' | 'dark'>,
        (theme) => {
          const themeColors = colors[theme];
          // Background and surface should be different for visual hierarchy
          return themeColors.background !== themeColors.surface;
        }
      ),
      { numRuns: 2 }
    );
  });

  it('should have distinct text and textSecondary colors for hierarchy', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light', 'dark') as fc.Arbitrary<'light' | 'dark'>,
        (theme) => {
          const themeColors = colors[theme];
          // Primary and secondary text should be different
          return themeColors.text !== themeColors.textSecondary;
        }
      ),
      { numRuns: 2 }
    );
  });

  it('should have distinct status colors (success, warning, error, info)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light', 'dark') as fc.Arbitrary<'light' | 'dark'>,
        (theme) => {
          const themeColors = colors[theme];
          const statusColors = [
            themeColors.success,
            themeColors.warning,
            themeColors.error,
            themeColors.info,
          ];
          // All status colors should be unique
          const uniqueColors = new Set(statusColors);
          return uniqueColors.size === statusColors.length;
        }
      ),
      { numRuns: 2 }
    );
  });
});
