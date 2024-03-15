// solution 1.
const inRangeBasic = (value: number, a: number, b = 0): boolean => {
  let [lower, upper] = [a, b];

  if (lower > upper) {
    lower = b;
    upper = a;
  }

  return lower <= value && value < upper;
};

// solution 2.
const inRangeEnhanced = (value: number, a: number, b = 0): boolean =>
  Math.min(a, b) <= value && value < Math.max(a, b);

export { inRangeBasic, inRangeEnhanced };
