import { describe, expect, test } from 'vitest';
import compose from './compose';

const basicCases = [
  {
    input: [(x: number) => x + 1, (x: number) => x * x, (x: number) => 2 * x],
    x: 4,
    expected: 65,
  },
  {
    input: [(x: number) => 10 * x, (x: number) => 10 * x, (x: number) => 10 * x],
    x: 1,
    expected: 1000,
  },
  {
    input: [],
    x: 5,
    expected: 5,
  },
];

const advancedCases = [
  {
    input: [
      (x: string) => `${x} - ${x}`,
      (x: string) => x.toUpperCase(),
      (x: string) => x + 12345,
    ],
    x: 'hello',
    expected: 'HELLO12345 - HELLO12345',
  },
  {
    input: [
      (x: { name: string; age: number }) => ({
        name: `${x.name} is so old!`,
        age: x.age * 2,
      }),
      (x: { name: string; age: number }) => ({
        name: `HELLO, ${x.name}`,
        age: x.age * 2,
      }),
      (x: { name: string; age: number }) => ({
        name: x.name.toUpperCase(),
        age: x.age * 2,
      }),
    ],
    x: { name: 'codefarmer', age: 18 },
    expected: {
      name: 'HELLO, CODEFARMER is so old!',
      age: 144,
    },
  },
];

const edgeCases = [
  {
    input: [(x: number) => x * x, (x: string) => `${x}${x}${x}`, (x: number) => x + 1],
    x: 4,
    expected: 308025,
  },
  {
    input: [(x: number) => x * x, () => 987, (x: number) => x + 100],
    x: 5,
    expected: 974169,
  },
  {
    input: [() => 987, (x: number) => x + 100, (x: number) => x * x],
    x: 'hello world',
    expected: 987,
  },
  {
    input: [(x: number) => x * x, (x: string) => x.toUpperCase(), (x: null) => typeof x],
    x: null,
    expected: NaN,
  },
];

describe('function composition', () => {
  test.each(basicCases)('should pass basic test cases - %s', ({ input, x, expected }) => {
    const result = compose(input)(x);

    expect(result).toEqual(expected);
  });

  test.each(advancedCases)(
    'should pass advanced test cases - %s',
    ({ input, x, expected }) => {
      const result = compose(input)(x);

      expect(result).toEqual(expected);
    }
  );

  test.each(edgeCases)('should pass edge cases - %s', ({ input, x, expected }) => {
    const result = compose(input)(x);

    expect(result).toEqual(expected);
  });
});
