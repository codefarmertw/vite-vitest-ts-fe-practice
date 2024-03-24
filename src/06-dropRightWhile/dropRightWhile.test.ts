import { describe, expect, it } from 'vitest';
import dropRightWhile from './dropRightWhile';

describe('dropRightWhile', () => {
  it('should drop elements from the end of the array until the predicate returns false', () => {
    expect(
      dropRightWhile(['hello', 'world', 'today', 'isGood'], (value) => value.length > 5)
    ).toEqual(['hello', 'world', 'today']);

    expect(
      dropRightWhile(
        [
          { name: 'Alice', age: 25 },
          { name: 'Charlie', age: 20 },
          { name: 'Bob', age: 30 },
        ],
        (obj) => obj.age > 25
      )
    ).toEqual([
      { name: 'Alice', age: 25 },
      { name: 'Charlie', age: 20 },
    ]);

    expect(dropRightWhile([10, 20, 30, 40, 50, 10], (value) => value !== 10)).toEqual([
      10, 20, 30, 40, 50, 10,
    ]);

    expect(dropRightWhile([1], (value) => value > 0)).toEqual([]);
  });
});
