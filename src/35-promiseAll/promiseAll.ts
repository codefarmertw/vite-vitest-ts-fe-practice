type PromiseFn<T> = () => Promise<T>;

const promiseAll = <T>(functions: PromiseFn<T>[]) => {
  if (functions.length === 0) {
    return [];
  }

  let counter = 0;
  const results: T[] = [];

  return new Promise((resolve, reject) => {
    functions.forEach(async (fn, index) => {
      try {
        const value = await fn();
        results[index] = value;
        counter++;
        if (counter >= functions.length) {
          resolve(results);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default promiseAll;
