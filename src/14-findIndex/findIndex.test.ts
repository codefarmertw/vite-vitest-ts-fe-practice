import { describe, expect, it } from 'vitest';
import findIndex from './findIndex';

describe('lodash.findIndex', () => {
  it('basic usage: number array', () => {
    const array = [5, 2, 4, 1, 3];
    const predicate1 = (value: number) => value > 2;
    const predicate2 = (value: number) => value > 7;

    expect(findIndex(array, predicate1)).toBe(0);
    expect(findIndex(array, predicate1, 1)).toBe(2);
    expect(findIndex(array, predicate2)).toBe(-1);
  });

  it('basic usage: string array', () => {
    const array = ['a', 'b', 'd', 'd', 'e'];
    const predicate1 = (value: string) => value === 'd';
    const predicate2 = (value: string) => value === 'f';

    expect(findIndex(array, predicate1)).toBe(2);
    expect(findIndex(array, predicate2)).toBe(-1);
  });

  it('basic usage: object array', () => {
    const array = [
      { name: 'a', age: 1 },
      { name: 'b', age: 2 },
      { name: 'c', age: 3 },
    ];
    const predicate1 = (value: { name: string; age: number }) => value.age > 2;
    const predicate2 = (value: { name: string; age: number }) => value.age > 7;

    expect(findIndex(array, predicate1)).toBe(2);
    expect(findIndex(array, predicate2)).toBe(-1);
  });

  it('edge cases: array is empty', () => {
    expect(findIndex([], () => true)).toBe(-1);
  });

  it('edge cases: fromIndex not in the range', () => {
    const array = [1, 2, 3, 4, 5];
    const predicate = (value: number) => value > 2;

    expect(findIndex(array, predicate, -1)).toBe(-1);
    expect(findIndex(array, predicate, 6)).toBe(-1);
  });
});
