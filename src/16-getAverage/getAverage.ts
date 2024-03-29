const getAverage = (array: number[]): number => {
  if (array.length === 0) {
    return 0;
  }

  return array.reduce((accu, curr) => accu + curr, 0) / array.length;
};

export default getAverage;
