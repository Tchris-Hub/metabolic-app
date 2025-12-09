import * as fc from 'fast-check';
import { 
  getButtonAccessibilityProps, 
  getInputAccessibilityProps 
} from '../accessibilityUtils';

/**
 * **Feature: ui-ux-modernization, Property 1: Button Accessibility Completeness**
 * **Validates: Requirements 1.1**
 * 
 * For any Button component instance, the component SHALL include 
 * accessibilityRole="button", a non-empty accessibilityLabel, 
 * and accessibilityState reflecting disabled/loading state.
 */
describe('Property 1: Button Accessibility Completeness', () => {
  it('should always return accessibilityRole="button" for any button props', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          disabled: fc.boolean(),
          loading: fc.boolean(),
          hint: fc.option(fc.string(), { nil: undefined }),
        }),
        (options) => {
          const props = getButtonAccessibilityProps(options);
          return props.accessibilityRole === 'button';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always return a non-empty accessibilityLabel matching the title', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          disabled: fc.boolean(),
          loading: fc.boolean(),
          hint: fc.option(fc.string(), { nil: undefined }),
        }),
        (options) => {
          const props = getButtonAccessibilityProps(options);
          return (
            props.accessibilityLabel === options.title &&
            props.accessibilityLabel.length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reflect disabled state when disabled is true', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          disabled: fc.constant(true),
          loading: fc.boolean(),
          hint: fc.option(fc.string(), { nil: undefined }),
        }),
        (options) => {
          const props = getButtonAccessibilityProps(options);
          return props.accessibilityState.disabled === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reflect busy state when loading is true', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          disabled: fc.boolean(),
          loading: fc.constant(true),
          hint: fc.option(fc.string(), { nil: undefined }),
        }),
        (options) => {
          const props = getButtonAccessibilityProps(options);
          return props.accessibilityState.busy === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should set disabled state to true when loading is true (even if disabled is false)', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          disabled: fc.constant(false),
          loading: fc.constant(true),
          hint: fc.option(fc.string(), { nil: undefined }),
        }),
        (options) => {
          const props = getButtonAccessibilityProps(options);
          // When loading, the button should be considered disabled
          return props.accessibilityState.disabled === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always have an accessibilityHint', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          disabled: fc.boolean(),
          loading: fc.boolean(),
          hint: fc.option(fc.string(), { nil: undefined }),
        }),
        (options) => {
          const props = getButtonAccessibilityProps(options);
          return (
            props.accessibilityHint !== undefined &&
            props.accessibilityHint.length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: ui-ux-modernization, Property 2: Input Accessibility Completeness**
 * **Validates: Requirements 1.2**
 * 
 * For any Input component instance with a label prop, the component SHALL 
 * include accessibilityLabel matching the label text.
 */
describe('Property 2: Input Accessibility Completeness', () => {
  it('should return accessibilityLabel matching the label when label is provided', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.string({ minLength: 1 }),
          placeholder: fc.option(fc.string(), { nil: undefined }),
          hint: fc.option(fc.string(), { nil: undefined }),
          disabled: fc.boolean(),
          error: fc.option(fc.string(), { nil: undefined }),
        }),
        (options) => {
          const props = getInputAccessibilityProps(options);
          return props.accessibilityLabel === options.label;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should fall back to placeholder when label is not provided', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.constant(undefined),
          placeholder: fc.string({ minLength: 1 }),
          hint: fc.option(fc.string(), { nil: undefined }),
          disabled: fc.boolean(),
          error: fc.option(fc.string(), { nil: undefined }),
        }),
        (options) => {
          const props = getInputAccessibilityProps(options);
          return props.accessibilityLabel === options.placeholder;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always have a non-empty accessibilityLabel', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          placeholder: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          hint: fc.option(fc.string(), { nil: undefined }),
          disabled: fc.boolean(),
          error: fc.option(fc.string(), { nil: undefined }),
        }),
        (options) => {
          const props = getInputAccessibilityProps(options);
          // Should always have a label (falls back to 'Text input' if neither label nor placeholder)
          return props.accessibilityLabel.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always have an accessibilityHint', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          placeholder: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          hint: fc.option(fc.string(), { nil: undefined }),
          disabled: fc.boolean(),
          error: fc.option(fc.string(), { nil: undefined }),
        }),
        (options) => {
          const props = getInputAccessibilityProps(options);
          return (
            props.accessibilityHint !== undefined &&
            props.accessibilityHint.length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should include error message in hint when error is present', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          placeholder: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          hint: fc.constant(undefined),
          disabled: fc.boolean(),
          error: fc.string({ minLength: 1 }),
        }),
        (options) => {
          const props = getInputAccessibilityProps(options);
          return props.accessibilityHint?.includes(options.error as string);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should set disabled state when disabled is true', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          placeholder: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          hint: fc.option(fc.string(), { nil: undefined }),
          disabled: fc.constant(true),
          error: fc.option(fc.string(), { nil: undefined }),
        }),
        (options) => {
          const props = getInputAccessibilityProps(options);
          return props.accessibilityState?.disabled === true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
