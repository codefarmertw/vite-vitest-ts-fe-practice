type CancelableTimeoutResult<R> = {
  cancel: () => void;
  fnResult: Promise<R>;
};

const cancelableTimeout = <T extends unknown[], R>(
  fn: (...args: T) => R,
  args: [...T],
  timeout: number
): CancelableTimeoutResult<R> => {
  let timeoutId: number | null = null;
  let isCancelled = false;

  const fnResult = new Promise<R>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      if (isCancelled) {
        reject(new Error('fn has been canceled!'));
      } else {
        resolve(fn(...args));
      }
    }, timeout);
  });

  const cancelFn = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      isCancelled = true;
    }
  };

  return {
    cancel: cancelFn,
    fnResult,
  };
};

export default cancelableTimeout;
