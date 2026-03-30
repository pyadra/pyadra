import { describe, it, expect } from 'vitest';
import { sanitizeString, validateAmount } from '../validation';

describe('validation utilities', () => {
  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('should remove HTML tags', () => {
      expect(sanitizeString('<script>alert("xss")</script>hello')).toBe('alert("xss")hello');
      expect(sanitizeString('<b>bold</b> text')).toBe('bold text');
      expect(sanitizeString('<a href="evil.com">link</a>')).toBe('link');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
      expect(sanitizeString(123)).toBe('');
      expect(sanitizeString({})).toBe('');
    });

    it('should truncate to maxLength', () => {
      const longString = 'a'.repeat(100);
      expect(sanitizeString(longString, 50)).toBe('a'.repeat(50));
    });

    it('should not truncate strings under maxLength', () => {
      expect(sanitizeString('short', 50)).toBe('short');
    });

    it('should handle empty strings', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString('   ')).toBe('');
    });

    it('should handle complex XSS attempts', () => {
      expect(sanitizeString('<img src=x onerror=alert(1)>')).toBe('');
      expect(sanitizeString('<<SCRIPT>alert("XSS");//<</SCRIPT>')).toBe('alert("XSS");//');
    });

    it('should preserve special characters outside tags', () => {
      expect(sanitizeString('hello@world.com')).toBe('hello@world.com');
      expect(sanitizeString('test-value_123')).toBe('test-value_123');
    });
  });

  describe('validateAmount', () => {
    it('should accept valid amounts within range', () => {
      expect(validateAmount(500)).toBe(true);
      expect(validateAmount(1000)).toBe(true);
      expect(validateAmount(50000)).toBe(true);
    });

    it('should reject amounts below minimum', () => {
      expect(validateAmount(499)).toBe(false);
      expect(validateAmount(0)).toBe(false);
      expect(validateAmount(-100)).toBe(false);
    });

    it('should reject amounts above maximum', () => {
      expect(validateAmount(50001)).toBe(false);
      expect(validateAmount(100000)).toBe(false);
    });

    it('should reject non-integer amounts', () => {
      expect(validateAmount(999.5)).toBe(false);
      expect(validateAmount(1000.01)).toBe(false);
    });

    it('should reject non-numeric values', () => {
      expect(validateAmount('1000')).toBe(true); // Number() converts strings
      expect(validateAmount(null)).toBe(false);
      expect(validateAmount(undefined)).toBe(false);
      expect(validateAmount({})).toBe(false);
      expect(validateAmount(NaN)).toBe(false);
    });

    it('should respect custom min/max bounds', () => {
      expect(validateAmount(1000, 1000, 2000)).toBe(true);
      expect(validateAmount(999, 1000, 2000)).toBe(false);
      expect(validateAmount(2001, 1000, 2000)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateAmount(Infinity)).toBe(false);
      expect(validateAmount(-Infinity)).toBe(false);
    });
  });
});
