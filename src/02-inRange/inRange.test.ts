import { describe, expect, it } from 'vitest';
// import { inRangeBasic as inRange } from './inRange';
import { inRangeEnhanced as inRange } from './inRange';

describe('inRange', () => {
  describe('three arguments', () => {
    it('should return true if the value is within the range', () => {
      expect(inRange(3, 2, 4)).toBe(true);
    });

    it('should return false if the value is not within the range', () => {
      expect(inRange(3, 4, 5)).toBe(false);
    });

    it('should return true if the value equals the lower bound', () => {
      expect(inRange(2, 2, 4)).toBe(true);
    });

    it('should return false if the value equals the upper bound', () => {
      expect(inRange(4, 2, 4)).toBe(false);
    });

    it('should return true if start is greater than end', () => {
      expect(inRange(3, 4, 2)).toBe(true);
    });

    it('should return false if the value is less than the lower bound', () => {
      expect(inRange(-1, 0, 4)).toBe(false);
    });

    it('should return false if the value is positive and range is negative', () => {
      expect(inRange(3, -3, 0)).toBe(false);
    });

    it('should return true if the value is negative and range is negative', () => {
      expect(inRange(-4, -10, -3)).toBe(true);
    });

    it('should return true if value is a floating-point number', () => {
      expect(inRange(3.5, 2, 4)).toBe(true);
    });

    it('should return true if start is a floating-point number', () => {
      expect(inRange(3, 2.5, 4)).toBe(true);
    });

    it('should return true if end is a floating-point number', () => {
      expect(inRange(3, 2, 4.5)).toBe(true);
    });
  });

  describe('two arguments, with the lower bound being 0', () => {
    it('should return true if the value is within the range 0 to 8', () => {
      expect(inRange(4, 8)).toBe(true);
    });

    it('should return false if the value is not within the range 0 to 2', () => {
      expect(inRange(4, 2)).toBe(false);
    });

    it('should return false if the value equals the upper bound', () => {
      expect(inRange(2, 2)).toBe(false);
    });

    it('should return false if all zero arguments', () => {
      expect(inRange(0, 0)).toBe(false);
    });

    it('should return false if the value is less than the lower bound', () => {
      expect(inRange(-1, 0)).toBe(false);
    });

    it('should return false if the lower bound is negative and the value is positive', () => {
      expect(inRange(3, -3)).toBe(false);
    });

    it('should return true if the lower bound is negative and the value is within the range', () => {
      expect(inRange(-4, -10)).toBe(true);
    });
  });
});
