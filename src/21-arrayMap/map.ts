const map = <T, R>(array: T[], fn: (element: T, index?: number, array?: T[]) => R) => {
  const result: R[] = [];

  for (let i = 0; i < array.length; i++) {
    result.push(fn(array[i], i, array));
  }

  return result;
};

export default map;
