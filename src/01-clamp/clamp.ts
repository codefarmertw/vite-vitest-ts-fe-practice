// solution 1. basic logic
const clampBasic = (number: number, lower: number, upper: number) => {
  if (number < lower) {
    return lower;
  } else if (number > upper) {
    return upper;
  } else {
    return number;
  }
};

// solution 2. Math
const clampWithMath = (number: number, lower: number, upper: number) =>
  Math.min(Math.max(number, lower), upper);

export { clampBasic, clampWithMath };
