import { describe, expect, it } from 'vitest';
import dropWhile from './dropWhile';

describe('dropWhile', () => {
  it('should return slice of the array while the predicate returns false', () => {
    const array = [0, 6, 1, 2, 3, 4];
    const predicate = (x: number) => x < 5;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([6, 1, 2, 3, 4]);
    expect(array).toEqual([0, 6, 1, 2, 3, 4]);
  });

  it('should return empty array if the predicate returns true for all elements', () => {
    const array = [1, 2, 3];
    const predicate = (x: number) => x < 5;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([]);
    expect(array).toEqual([1, 2, 3]);
  });

  it('string array should work', () => {
    const array = ['a', 'b', 'x', 'y', 'z', 'c', 'b'];
    const predicate = (x: string) => ['a', 'b', 'c'].includes(x);

    const result = dropWhile(array, predicate);

    expect(result).toEqual(['x', 'y', 'z', 'c', 'b']);
    expect(array).toEqual(['a', 'b', 'x', 'y', 'z', 'c', 'b']);
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
      { name: 'w', age: 6 },
      { name: 'x', age: 5 },
      { name: 'y', age: 1 },
      { name: 'z', age: 2 },
      { name: 'b', age: 3 },
    ];
    const predicate = (x: { name: string; age: number }) => x.age < 4 && x.name !== 'w';

    const result = dropWhile(array, predicate);

    expect(result).toEqual([
      { name: 'w', age: 6 },
      { name: 'x', age: 5 },
      { name: 'y', age: 1 },
      { name: 'z', age: 2 },
      { name: 'b', age: 3 },
    ]);
    expect(array).toEqual([
      { name: 'a', age: 1 },
      { name: 'w', age: 6 },
      { name: 'x', age: 5 },
      { name: 'y', age: 1 },
      { name: 'z', age: 2 },
      { name: 'b', age: 3 },
    ]);
  });
});
