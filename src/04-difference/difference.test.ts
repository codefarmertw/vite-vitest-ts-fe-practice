import { describe, expect, it } from 'vitest';
import difference from './difference';

describe('difference', () => {
  it('should return an array', () => {
    expect(Array.isArray(difference([], []))).toBe(true);
  });

  it('should return an array with the difference of two arrays', () => {
    expect(difference([1, 1, 2, 3], [2, 3])).toEqual([1, 1]);
    expect(difference([1, 2, 3], [1, 2, 3, 4])).toEqual([]);
    expect(difference([4, 3, 2, 1], [1, 2, 3])).toEqual([4]);
  });

  it('edge cases', () => {
    expect(
      difference([undefined, null, 0, '0', false, NaN], [null, 0, '0', false])
    ).toEqual([undefined, NaN]);
  });
});
