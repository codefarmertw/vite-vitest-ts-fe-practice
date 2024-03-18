const cancelableInterval = <T extends unknown[], R>(
  fn: (...args: T) => R,
  args: [...T],
  t: number
) => {
  let currentTime = 0;

  // 因為題目需求要能立即使用參數 args 呼叫，這裡初始值 call 一次 fn
  const output = [
    {
      time: currentTime,
      returned: fn(...args),
    },
  ];

  const intervalId = setInterval(() => {
    currentTime += t;
    output.push({
      time: currentTime,
      returned: fn(...args),
    });
  }, t);

  // 為了單元測試方便做斷言，這裡也將 output 存下來做為輸出
  return {
    cancel: () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    },
    output,
  };
};

export default cancelableInterval;
