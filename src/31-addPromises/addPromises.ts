type AddTwoPromisesType = (
  promise1: Promise<number>,
  promise2: Promise<number>
) => Promise<number>;

type AddPromisesType = (promises: Promise<number>[]) => Promise<number>;

const addTwoPromises: AddTwoPromisesType = (promise1, promise2) => {
  return new Promise((resolve, reject) => {
    Promise.all([promise1, promise2])
      .then(([num1, num2]) => resolve(num1 + num2))
      .catch((error) => reject(error));
  });
};

const addPromises: AddPromisesType = (promises) => {
  return new Promise((resolve) => {
    Promise.allSettled(promises).then((results) => {
      // return the sum of the resolved values
      resolve(
        results
          .filter(
            (result): result is PromiseFulfilledResult<number> =>
              result.status === 'fulfilled'
          )
          .reduce<number>((acc, result) => acc + result.value, 0)
      );
    });
  });
};

export { addTwoPromises, addPromises };
