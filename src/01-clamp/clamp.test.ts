import { describe, expect, it } from 'vitest';
import * as utils from './clamp';

describe('clamp', () => {
  it('should return the number if it is within the range', () => {
    expect(utils.clampBasic(7, 0, 9)).toBe(7);
    expect(utils.clampWithMath(7, 0, 9)).toBe(7);
  });

  it('should return the lower bound if the number is less than the lower bound', () => {
    expect(utils.clampBasic(-12, -4, 5)).toBe(-4);
    expect(utils.clampWithMath(-12, -4, 5)).toBe(-4);
  });

  it('should return the upper bound if the number is greater than the upper bound', () => {
    expect(utils.clampBasic(18, 3, 9)).toBe(9);
    expect(utils.clampWithMath(18, 3, 9)).toBe(9);
  });
});
