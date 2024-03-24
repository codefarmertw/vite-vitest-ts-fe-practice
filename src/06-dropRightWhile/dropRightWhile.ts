const dropRightWhile = <T>(
  array: T[],
  predicate: (value: T, index?: number, array?: T[]) => boolean
) => {
  const result: T[] = [];

  for (let i = array.length - 1; i > 0; i--) {
    if (!predicate(array[i], i, array)) {
      result.push(...array.slice(0, i + 1));
      break;
    }
  }

  return result;
};

export default dropRightWhile;
