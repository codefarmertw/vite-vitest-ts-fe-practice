export enum ACTION_ENUM {
  ADD = 'add',
  SUBTRACT = 'subtract',
  MULTIPLY = 'multiply',
  DIVIDE = 'divide',
  POWER = 'power',
  GET_RESULT = 'getResult',
}

export default class Calculator {
  private result: number;

  constructor(initialValue: number) {
    this.result = initialValue;
  }

  [ACTION_ENUM.ADD] = (value: number) => {
    this.result += value;

    return this;
  };

  [ACTION_ENUM.SUBTRACT] = (value: number) => {
    this.result -= value;

    return this;
  };

  [ACTION_ENUM.MULTIPLY] = (value: number) => {
    this.result *= value;

    return this;
  };

  [ACTION_ENUM.DIVIDE] = (value: number) => {
    if (value === 0) {
      throw new Error('Division by zero is not allowed');
    }

    this.result /= value;

    return this;
  };

  [ACTION_ENUM.POWER] = (value: number) => {
    this.result **= value;

    return this;
  };

  [ACTION_ENUM.GET_RESULT] = () => {
    return Number(this.result.toFixed(1));
  };
}
