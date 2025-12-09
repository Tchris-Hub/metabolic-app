import { AccessibilityRole, AccessibilityState } from 'react-native';

/**
 * Accessibility props interface for buttons
 */
export interface ButtonAccessibilityProps {
  accessibilityRole: AccessibilityRole;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityState: AccessibilityState;
}

/**
 * Accessibility props interface for inputs
 */
export interface InputAccessibilityProps {
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
}

/**
 * Options for generating button accessibility props
 */
export interface ButtonAccessibilityOptions {
  title: string;
  disabled?: boolean;
  loading?: boolean;
  hint?: string;
}

/**
 * Options for generating input accessibility props
 */
export interface InputAccessibilityOptions {
  label?: string;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  error?: string;
}

/**
 * Generates accessibility props for Button components
 * Ensures WCAG 2.1 compliance by providing role, label, and state
 * 
 * @param options - Button configuration options
 * @returns Accessibility props object for the button
 */
export function getButtonAccessibilityProps(
  options: ButtonAccessibilityOptions
): ButtonAccessibilityProps {
  const { title, disabled = false, loading = false, hint } = options;

  // Generate a meaningful accessibility hint if not provided
  const defaultHint = `Tap to ${title.toLowerCase()}`;

  return {
    accessibilityRole: 'button',
    accessibilityLabel: title,
    accessibilityHint: hint || defaultHint,
    accessibilityState: {
      disabled: disabled || loading,
      busy: loading,
    },
  };
}

/**
 * Generates accessibility props for Input components
 * Ensures WCAG 2.1 compliance by providing label and hints
 * 
 * @param options - Input configuration options
 * @returns Accessibility props object for the input
 */
export function getInputAccessibilityProps(
  options: InputAccessibilityOptions
): InputAccessibilityProps {
  const { label, placeholder, hint, disabled = false, error } = options;

  // Use label if available, otherwise fall back to placeholder
  const accessibilityLabel = label || placeholder || 'Text input';

  // Generate hint based on input state
  let accessibilityHint = hint;
  if (!accessibilityHint) {
    if (error) {
      accessibilityHint = `Error: ${error}`;
    } else {
      accessibilityHint = `Enter ${accessibilityLabel.toLowerCase()}`;
    }
  }

  const props: InputAccessibilityProps = {
    accessibilityLabel,
    accessibilityHint,
  };

  // Only add state if there's something to report
  if (disabled) {
    props.accessibilityState = { disabled: true };
  }

  return props;
}
