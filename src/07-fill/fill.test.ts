import { describe, expect, it } from 'vitest';
import fill from './fill';

describe('Array.fill', () => {
  it('should handle basic cases', () => {
    expect(fill([1, 2, 3], '*')).toEqual(['*', '*', '*']);
    expect(fill([1, 2], '*', 2, 3)).toEqual([1, 2]);
    expect(fill([1, 2, 3, 4, 5], '*', 1, -1)).toEqual([1, '*', '*', '*', 5]);
  });

  it('should return the original array', () => {
    const arr = [1, 2, 3];

    expect(fill(arr, '*')).toBe(arr);
  });

  it('should handle edge cases', () => {
    expect(fill([], '*')).toEqual([]);
    expect(fill([1, 2, 3], '*', 0, 0)).toEqual([1, 2, 3]);
    expect(fill([1, 2, 3], '*', 1, 1)).toEqual([1, 2, 3]);
    expect(fill([1, 2, 3], '*', -1, -1)).toEqual([1, 2, 3]);
    expect(fill([1, 2, 3, 4, 5], '*', 3, 1)).toEqual([1, 2, 3, 4, 5]);
    expect(fill([1, 2, 3, 4, 5], '*', -3)).toEqual([1, 2, '*', '*', '*']);
    expect(fill([1, 2, 3, 4, 5], '*', -3, -2)).toEqual([1, 2, '*', 4, 5]);
    expect(fill([1, 2, 3, 4, 5], '*', -5, -2)).toEqual(['*', '*', '*', 4, 5]);
    expect(fill([1, 2, 3, 4, 5], '*', -7, -2)).toEqual(['*', '*', '*', 4, 5]);
    expect(fill([1, 2, 3, 4, 5], '*', -7, -4)).toEqual(['*', 2, 3, 4, 5]);
    expect(fill([1, 2, 3, 4, 5], '*', -7, -5)).toEqual([1, 2, 3, 4, 5]);
    expect(fill([1, 2, 3, 4, 5], '*', NaN, NaN)).toEqual([1, 2, 3, 4, 5]);
    expect(fill([1, 2, 3, 4, 5], '*', -20)).toEqual(['*', '*', '*', '*', '*']);
  });

  it('should handle objects by reference', () => {
    const arr = fill(Array(3), {});
    arr[0].hi = 'hi';

    expect(arr).toEqual([{ hi: 'hi' }, { hi: 'hi' }, { hi: 'hi' }]);
  });
});
