import { describe, expect, it } from 'vitest';
import dropWhile from './dropWhile';

describe('dropWhile', () => {
  it('should drop elements from the array while the predicate returns true', () => {
    const array = [1, 2, 3, 4, 5, 6];
    const predicate = (x: number) => x < 4;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([4, 5, 6]);
    expect(array).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should return empty array if the predicate returns true for all elements', () => {
    const array = [1, 2, 3];
    const predicate = (x: number) => x < 5;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([]);
    expect(array).toEqual([1, 2, 3]);
  });

  it('string array should work', () => {
    const array = ['a', 'b', 'c', 'd', 'e', 'f'];
    const predicate = (x: string) => ['a', 'b', 'c'].includes(x);

    const result = dropWhile(array, predicate);

    expect(result).toEqual(['d', 'e', 'f']);
    expect(array).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });

  it('should return empty array if the array is empty', () => {
    const array: number[] = [];
    const predicate = (x: number) => x < 5;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([]);
  });

  it('object array should work', () => {
    const array = [
      { name: 'a', age: 1 },
      { name: 'b', age: 2 },
      { name: 'c', age: 3 },
      { name: 'd', age: 4 },
      { name: 'e', age: 5 },
      { name: 'f', age: 6 },
    ];
    const predicate = (x: { name: string; age: number }) => x.age < 4;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([
      { name: 'd', age: 4 },
      { name: 'e', age: 5 },
      { name: 'f', age: 6 },
    ]);
    expect(array).toEqual([
      { name: 'a', age: 1 },
      { name: 'b', age: 2 },
      { name: 'c', age: 3 },
      { name: 'd', age: 4 },
      { name: 'e', age: 5 },
      { name: 'f', age: 6 },
    ]);
  });
});
