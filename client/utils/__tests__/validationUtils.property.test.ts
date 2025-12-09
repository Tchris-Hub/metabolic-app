import * as fc from 'fast-check';
import { validateEmail, calculatePasswordStrength } from '../validationUtils';

/**
 * **Feature: ui-ux-modernization, Property 5: Email Validation Correctness**
 * **Validates: Requirements 4.1**
 * 
 * For any string input, the email validation function SHALL return isValid=true 
 * only for strings matching standard email format (contains @ and valid domain).
 */
describe('Property 5: Email Validation Correctness', () => {
  it('should return isValid=true for valid email formats', () => {
    // Generate valid emails: local@domain.tld
    const validEmailArb = fc.tuple(
      fc.stringMatching(/^[a-zA-Z0-9._%+-]+$/), // local part
      fc.stringMatching(/^[a-zA-Z0-9.-]+$/),    // domain
      fc.stringMatching(/^[a-zA-Z]{2,}$/)       // tld (at least 2 chars)
    ).filter(([local, domain, tld]) => 
      local.length > 0 && domain.length > 0 && tld.length >= 2
    ).map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

    fc.assert(
      fc.property(validEmailArb, (email) => {
        const result = validateEmail(email);
        return result.isValid === true;
      }),
      { numRuns: 100 }
    );
  });

  it('should return isValid=false for strings without @ symbol', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !s.includes('@') && s.length > 0),
        (input) => {
          const result = validateEmail(input);
          return result.isValid === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return isValid=false for empty strings', () => {
    fc.assert(
      fc.property(
        fc.constant(''),
        (input) => {
          const result = validateEmail(input);
          return result.isValid === false && result.error !== undefined;
        }
      ),
      { numRuns: 1 }
    );
  });

  it('should return isValid=false for whitespace-only strings', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom(' ', '\t', '\n')).filter(s => s.length > 0),
        (input) => {
          const result = validateEmail(input);
          return result.isValid === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return isValid=false for emails without domain after @', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => !s.includes('@')),
        (local) => {
          const result = validateEmail(`${local}@`);
          return result.isValid === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return isValid=false for emails without TLD (no dot after @)', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({ minLength: 1 }).filter(s => !s.includes('@') && !s.includes(' ')),
          fc.string({ minLength: 1 }).filter(s => !s.includes('.') && !s.includes('@') && !s.includes(' '))
        ),
        ([local, domain]) => {
          const result = validateEmail(`${local}@${domain}`);
          return result.isValid === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always return an error message when isValid is false', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (input) => {
          const result = validateEmail(input);
          if (!result.isValid) {
            return result.error !== undefined && result.error.length > 0;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * **Feature: ui-ux-modernization, Property 6: Password Strength Monotonicity**
 * **Validates: Requirements 4.2**
 * 
 * For any two passwords where password A is a prefix of password B 
 * (B has additional characters), the strength score of B SHALL be 
 * greater than or equal to the strength score of A.
 */
describe('Property 6: Password Strength Monotonicity', () => {
  it('should have score(B) >= score(A) when B extends A with additional characters', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({ minLength: 0, maxLength: 20 }), // prefix (password A)
          fc.string({ minLength: 1, maxLength: 10 })  // suffix to append
        ),
        ([prefix, suffix]) => {
          const passwordA = prefix;
          const passwordB = prefix + suffix;
          
          const strengthA = calculatePasswordStrength(passwordA);
          const strengthB = calculatePasswordStrength(passwordB);
          
          return strengthB.score >= strengthA.score;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return score of 0 for empty password', () => {
    fc.assert(
      fc.property(
        fc.constant(''),
        (password) => {
          const strength = calculatePasswordStrength(password);
          return strength.score === 0 && strength.level === 'weak';
        }
      ),
      { numRuns: 1 }
    );
  });

  it('should return score between 0 and 100 for any password', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (password) => {
          const strength = calculatePasswordStrength(password);
          return strength.score >= 0 && strength.score <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return valid level for any password', () => {
    const validLevels = ['weak', 'fair', 'good', 'strong'];
    
    fc.assert(
      fc.property(
        fc.string(),
        (password) => {
          const strength = calculatePasswordStrength(password);
          return validLevels.includes(strength.level);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always return suggestions array', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (password) => {
          const strength = calculatePasswordStrength(password);
          return Array.isArray(strength.suggestions) && strength.suggestions.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should increase score when adding character variety', () => {
    // Test that adding different character types increases score
    fc.assert(
      fc.property(
        fc.string({ minLength: 4, maxLength: 8 }).filter(s => /^[a-z]+$/.test(s)),
        (lowercaseOnly) => {
          const baseStrength = calculatePasswordStrength(lowercaseOnly);
          
          // Adding uppercase should increase or maintain score
          const withUppercase = lowercaseOnly + 'A';
          const upperStrength = calculatePasswordStrength(withUppercase);
          
          // Adding number should increase or maintain score
          const withNumber = lowercaseOnly + '1';
          const numberStrength = calculatePasswordStrength(withNumber);
          
          // Adding special char should increase or maintain score
          const withSpecial = lowercaseOnly + '!';
          const specialStrength = calculatePasswordStrength(withSpecial);
          
          return (
            upperStrength.score >= baseStrength.score &&
            numberStrength.score >= baseStrength.score &&
            specialStrength.score >= baseStrength.score
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have level consistent with score ranges', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (password) => {
          const strength = calculatePasswordStrength(password);
          
          if (strength.score < 30) return strength.level === 'weak';
          if (strength.score < 50) return strength.level === 'fair';
          if (strength.score < 75) return strength.level === 'good';
          return strength.level === 'strong';
        }
      ),
      { numRuns: 100 }
    );
  });
});
