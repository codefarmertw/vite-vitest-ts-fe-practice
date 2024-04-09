import { describe, expect, test } from 'vitest';
import Calculator, { ACTION_ENUM } from './Calculator';

const testCases = [
  {
    title: 'basic case 1',
    actions: [ACTION_ENUM.ADD, ACTION_ENUM.SUBTRACT, ACTION_ENUM.GET_RESULT],
    initialValue: 10,
    values: [5, 7],
    expected: 8,
  },
  {
    title: 'basic case 2',
    actions: [ACTION_ENUM.MULTIPLY, ACTION_ENUM.POWER, ACTION_ENUM.GET_RESULT],
    initialValue: 2,
    values: [5, 2],
    expected: 100,
  },
  {
    title: 'floating number calculation',
    actions: [
      ACTION_ENUM.MULTIPLY,
      ACTION_ENUM.POWER,
      ACTION_ENUM.DIVIDE,
      ACTION_ENUM.GET_RESULT,
    ],
    initialValue: 9,
    values: [13, 5, 11],
    expected: 1993134577.9,
  },
  {
    title: 'floating number issue',
    actions: [ACTION_ENUM.ADD, ACTION_ENUM.GET_RESULT],
    initialValue: 0.1,
    values: [0.2],
    expected: 0.3,
  },
  {
    title: 'big number issue 1',
    actions: [ACTION_ENUM.MULTIPLY, ACTION_ENUM.POWER, ACTION_ENUM.GET_RESULT],
    initialValue: 999999,
    values: [999999, 999999],
    expected: Infinity,
  },
  {
    title: 'big number issue 2',
    actions: [ACTION_ENUM.MULTIPLY, ACTION_ENUM.POWER, ACTION_ENUM.GET_RESULT],
    initialValue: Number.MAX_SAFE_INTEGER,
    values: [Number.MAX_SAFE_INTEGER, 2],
    expected: 6.582018229284821e63,
  },
  {
    title: 'NaN case',
    actions: [
      ACTION_ENUM.ADD,
      ACTION_ENUM.DIVIDE,
      ACTION_ENUM.MULTIPLY,
      ACTION_ENUM.GET_RESULT,
    ],
    initialValue: 5,
    values: [2, NaN, 0],
    expected: NaN,
  },
  {
    title: 'divide by zero',
    actions: [ACTION_ENUM.DIVIDE, ACTION_ENUM.GET_RESULT],
    initialValue: 5,
    values: [0],
    expectedError: 'Division by zero is not allowed',
  },
];

describe('Calculator class', () => {
  test.each(testCases)(
    '$title',
    ({ actions, initialValue, values, expected, expectedError }) => {
      const calculator = new Calculator(initialValue);

      try {
        actions.forEach((action, index) => {
          if (action === ACTION_ENUM.GET_RESULT) {
            expect(calculator.getResult()).toBe(expected);
          } else {
            calculator[action](values[index]);
          }
        });
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe(expectedError);
        }
      }
    }
  );
});
