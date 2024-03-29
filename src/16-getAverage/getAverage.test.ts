import { expect, it } from 'vitest';
import getAverage from './getAverage';

const testCases = [
  [[0, -1, 2, -3, 4, -5], [-0.5]],
  [[1.25, 2.5, 3.75, 5.9], [3.35]],
  [[NaN, NaN], [NaN]],
  [[Infinity, -Infinity], [NaN]],
  [[], [0]],
];

it('get array average', () => {
  testCases.forEach(([input, expected]) => {
    expect(getAverage(input)).toEqual(expected[0]);
  });
});
