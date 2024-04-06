import { describe, expect, test } from 'vitest';
import filter from './filter';

const basicCases = [
  {
    input: [0, 10, 20, 30],
    fn: (n: number) => n > 10,
    expected: [20, 30],
  },
  {
    input: [1, 2, 3, 4, 5, 6],
    fn: (n: number, i: number) => i === 0,
    expected: [1],
  },
  {
    input: [
      {
        name: 'codefarmer',
        age: 18,
      },
      {
        name: 'bob',
        age: 20,
      },
      {
        name: 'alice',
        age: 22,
      },
    ],
    fn: (n: { name: string; age: number }) => n.age >= 20,
    expected: [
      {
        name: 'bob',
        age: 20,
      },
      {
        name: 'alice',
        age: 22,
      },
    ],
  },
];

const edgeCases = [
  {
    input: [],
    fn: (n: number) => n > 2,
    expected: [],
  },
  {
    input: [10, 20, 30, 40, 50, 60],
    fn: (n: number) => n > 100,
    expected: [],
  },
];

describe('array filter', () => {
  test.each(basicCases)(
    'should pass basic test cases - %s',
    ({ input, fn, expected }) => {
      const result = filter(input, fn);

      expect(result).toEqual(expected);
      expect(result).not.toBe(input);
    }
  );

  test.each(edgeCases)('should pass edge cases - %s', ({ input, fn, expected }) => {
    const result = filter(input, fn);

    expect(result).toEqual(expected);
    expect(result).not.toBe(input);
  });
});
