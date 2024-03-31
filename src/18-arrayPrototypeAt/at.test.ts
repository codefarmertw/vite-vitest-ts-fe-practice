import { describe, expect, test } from 'vitest';
import './at';

const input = ['code', 'farmer', 'tw'];
const basicCases = [
  {
    index: 1,
    expected: 'farmer',
  },
  {
    index: 3,
    expected: undefined,
  },
  {
    index: -1,
    expected: 'tw',
  },
  {
    index: -3,
    expected: 'code',
  },
  {
    index: -4,
    expected: undefined,
  },
];

const floatingNumberCases = [
  {
    index: 1.25,
    expected: 'farmer',
  },
  {
    index: 3.5,
    expected: undefined,
  },
  {
    index: -1.25,
    expected: 'tw',
  },
];

const nonNumberCases = [
  {
    index: NaN,
    expected: 'code',
  },
  {
    index: -0,
    expected: 'code',
  },
  {
    index: undefined,
    expected: 'code',
  },
  {
    index: null,
    expected: 'code',
  },
  {
    index: {},
    expected: 'code',
  },
  {
    index: Infinity,
    expected: undefined,
  },
  {
    index: -Infinity,
    expected: undefined,
  },
  {
    index: 'hello',
    expected: 'code',
  },
  {
    index: '2',
    expected: 'tw',
  },
  {
    index: false,
    expected: 'code',
  },
  {
    index: true,
    expected: 'farmer',
  },
  {
    index: [],
    expected: 'code',
  },
  {
    index: [2],
    expected: 'tw',
  },
  {
    index: [2, 3],
    expected: 'code',
  },
  {
    index: () => 2,
    expected: 'code',
  },
];

describe('rewrite Array.prototype.at practice', () => {
  test.each(basicCases)('should pass basic test cases - %s', ({ index, expected }) => {
    expect(input.at(index)).toBe(expected);
  });

  test.each(floatingNumberCases)(
    'should pass floating number test cases - %s',
    ({ index, expected }) => {
      expect(input.at(index)).toBe(expected);
    }
  );

  test.each(nonNumberCases)(
    'should pass non number test cases - %s',
    ({ index, expected }) => {
      expect(input.at(index)).toBe(expected);
    }
  );
});
