// solution 1. basic logic
// const dropWhile = <T>(array: T[], predicate: (arg: T) => boolean) =>
  // array.filter((a) => !predicate(a));


const dropWhile = <T>(array: T[], predicate: (arg: T) => boolean) => {
  const result: T[] = [];

  array.forEach((a) => {
    if (!predicate(a)) {
      result.push(a);
    }
  });

  return result;
}


export default dropWhile;
