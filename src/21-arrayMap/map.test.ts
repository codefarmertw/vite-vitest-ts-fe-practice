import { describe, expect, test } from 'vitest';
import map from './map';

const basicCases = [
  {
    input: [1, 2, 3, 4, 5, 6],
    fn: (x: number) => x * 2,
    expected: [2, 4, 6, 8, 10, 12],
  },
  {
    input: [1, 2, 3, 4, 5, 6],
    fn: (x: number, index: number) => x + index,
    expected: [1, 3, 5, 7, 9, 11],
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
    fn: (x: { name: string; age: number }) => ({
      name: x.name.toUpperCase(),
      age: x.age * 2,
    }),
    expected: [
      {
        name: 'CODEFARMER',
        age: 36,
      },
      {
        name: 'BOB',
        age: 40,
      },
      {
        name: 'ALICE',
        age: 44,
      },
    ],
  },
];

const edgeCases = [
  {
    input: [],
    fn: (x: number) => x + 2,
    expected: [],
  },
];

describe('Array.map', () => {
  test.each(basicCases)(
    'should pass basic test cases - %s',
    ({ input, fn, expected }) => {
      const result = map(input, fn);

      expect(result).toEqual(expected);
      expect(result).not.toBe(input);
    }
  );

  test.each(edgeCases)('should pass edge cases - %s', ({ input, fn, expected }) => {
    const result = map(input, fn);

    expect(result).toEqual(expected);
    expect(result).not.toBe(input);
  });
});
