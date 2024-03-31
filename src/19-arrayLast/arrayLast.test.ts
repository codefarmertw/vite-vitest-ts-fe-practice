import { describe, expect, test } from 'vitest';
import './arrayLast';

const testCases = [
  {
    input: [null, {}, [], false, 'codefarmer'],
    expected: 'codefarmer',
  },
  {
    input: [],
    expected: -1,
  },
  {
    input: [
      'codefarmer',
      {
        name: 'codefarmer',
        age: 18,
      },
    ],
    expected: {
      name: 'codefarmer',
      age: 18,
    },
  },
];

describe('Array.prototype.last', () => {
  test.each(testCases)('should pass test cases - %s', ({ input, expected }) => {
    if (typeof expected === 'object') {
      expect(input.last()).toBe(input[input.length - 1]);
    } else {
      expect(input.last()).toBe(expected);
    }
  });
});
