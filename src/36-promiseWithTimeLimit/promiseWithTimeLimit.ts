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

export {
  promiseWithTimeLimit as default,
  type RejectedResultType,
  type ResolvedResultType,
};
