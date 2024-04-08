import { describe, expect, test, it } from 'vitest';
import Calculator, { ACTION_ENUM } from './Calculator';

const basicCases = [
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
];

const edgeCases = [
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
    expected: 6.582018229284821e+63,
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
];

describe('Calculator class', () => {
  test.each(basicCases)(
    'should pass basic test cases - $title',
    ({ actions, initialValue, values, expected }) => {
      let calculator = new Calculator(initialValue);

      actions.forEach((action, index) => {
        if (action === ACTION_ENUM.GET_RESULT) {
          expect(calculator.getResult()).toBe(expected);
        } else {
          calculator = calculator[action](values[index]);
        }
      });
    }
  );

  test.each(edgeCases)(
    'should pass edge test cases - $title',
    ({ actions, initialValue, values, expected }) => {
      let calculator = new Calculator(initialValue);

      actions.forEach((action, index) => {
        if (action === ACTION_ENUM.GET_RESULT) {
          expect(calculator.getResult()).toBe(expected);
        } else {
          calculator = calculator[action](values[index]);
        }
      });
    }
  );

  it('should throw error if division by zero', () => {
    let calculator = new Calculator(5);

    expect(() => calculator[ACTION_ENUM.DIVIDE](0)).toThrowError(
      'Division by zero is not allowed'
    );
  });
});
