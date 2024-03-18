const cancelableTimeout = <T extends unknown[], R>(
  fn: (...args: T) => R,
  args: [...T],
  timeout: number
) => {
  let output: {
    time: number;
    returned: R;
  }[] = [];

  const timeoutId = setTimeout(() => {
    output.push({
      time: timeout,
      returned: fn(...args),
    });
  }, timeout);

  return {
    cancel: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    },
    output,
  };
};

export default cancelableTimeout;
