import { expect, it } from 'vitest';
import './square';

const testCases = [
  [
    [0, -1, 2, -3, 4, -5],
    [0, 1, 4, 9, 16, 25],
  ],
  [
    [1.25, 2.5, 3.75, 5.9],
    [1.5625, 6.25, 14.0625, 34.81],
  ],
  [
    [NaN, NaN],
    [NaN, NaN],
  ],
  [
    [Infinity, -Infinity],
    [Infinity, Infinity],
  ],
  [
    ['code', 'farmer', 'codefarmer'],
    [NaN, NaN, NaN],
  ],
  [
    [
      { name: 'code', age: 18 },
      { name: 'farmer', age: 18 },
    ],
    [NaN, NaN],
  ],
  [[], []],
];

it('Array.prototype.square', () => {
  testCases.forEach(([input, expected]) => {
    expect(input.square()).toEqual(expected);
  });
});
