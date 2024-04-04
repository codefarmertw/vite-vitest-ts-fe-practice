type InputPromiseFn<T extends unknown[], R> = (...args: T) => Promise<R>;

interface ResolvedResultType<R> {
  resolved: R;
  time: number;
}

interface RejectedResultType {
  rejected: string;
  time: number;
}

type ResultType<R> = ResolvedResultType<R> | RejectedResultType;

type OutputPromiseFn<T extends unknown[], R> = (...args: T) => Promise<ResultType<R>>;

// v1: 回傳 time 且沒用 Promise.race 的版本
const promiseWithTimeLimit = <T extends unknown[], R>(
  fn: InputPromiseFn<T, R>,
  t: number
): OutputPromiseFn<T, R> => {
  // 計算開始時間
  const startTime = performance.now();

  // 能輸出一個可傳入 ...args 的 Promise 函式
  return (...args) =>
    new Promise((resolve, reject) => {
      // 當超過 t 時間，則 reject
      const timeoutId = setTimeout(() => {
        reject({
          rejected: 'Time Limit Exceeded',
          time: Math.ceil(performance.now() - startTime),
        });
      }, t);

      // 執行 fn 並與 timeout function 競爭看誰先完成
      fn(...args).then((res) => {
        // 如果更早完成，需清掉 timeoutId 並 resolve 結果
        clearTimeout(timeoutId);
        resolve({
          resolved: res,
          time: Math.ceil(performance.now() - startTime),
        });
      });
    });
};

// v2: 回傳 time 且用 Promise.race 的版本
const promiseWithTimeLimitPromiseRace = <T extends unknown[], R>(
  fn: InputPromiseFn<T, R>,
  t: number
): OutputPromiseFn<T, R> => {
  const startTime = performance.now();

  return (...args) => {
    const timeoutPromise = new Promise<RejectedResultType>((_, reject) =>
      setTimeout(
        () =>
          reject({
            rejected: 'Time Limit Exceeded',
            time: Math.ceil(performance.now() - startTime),
          }),
        t
      )
    );

    const fnPromise = fn(...args)
      .then((result) => ({
        resolved: result,
        time: Math.ceil(performance.now() - startTime),
      }))
      .catch((error) => ({
        rejected: error instanceof Error ? error.message : String(error),
        time: Math.ceil(performance.now() - startTime),
      }));

    return Promise.race([fnPromise, timeoutPromise]);
  };
};

// v3: 不回傳 time 且用 Promise.race 的簡潔版本
const promiseWithTimeLimitSimple = <T extends unknown[], R>(
  fn: InputPromiseFn<T, R>,
  t: number
) => {
  return (...args: T) => {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject('Time Limit Exceeded'), t)
    );

    return Promise.race([fn(...args), timeoutPromise]);
  };
};

export {
  promiseWithTimeLimit as default,
  promiseWithTimeLimitPromiseRace,
  promiseWithTimeLimitSimple,
  type RejectedResultType,
  type ResolvedResultType,
};
