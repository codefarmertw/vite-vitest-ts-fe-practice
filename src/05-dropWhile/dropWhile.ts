const dropWhile = <T>(
  array: T[],
  predicate: (value: T, index?: number, array?: T[]) => boolean
) => {
  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i], i, array)) {
      result.push(...array.slice(i));
      break;
    }
  }

  return result;
};

export default dropWhile;
