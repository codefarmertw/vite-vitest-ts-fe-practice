const repeatBasic = <T, R>(func: (arg: T) => R, times: number, duration: number) => {
  let counter = 0;

  return (arg: T) => {
    const intervalId = setInterval(() => {
      if (counter >= times) {
        clearInterval(intervalId);
      } else {
        counter++;
        func(arg);
      }
    }, duration);
  };
};

const repeatAdvanced = <T extends unknown[], R>(
  func: (...args: T) => R,
  times: number,
  duration: number
) => {
  let counter = 0;
  const output: R[] = [];

  const repeatFunc = (...args: T) => {
    const intervalId = setInterval(() => {
      if (counter >= times) {
        clearInterval(intervalId);
      } else {
        counter++;
        const res = func(...args);

        if (!!res) {
          output.push(res);
        }
      }
    }, duration);
  };

  return {
    repeatFunc,
    output,
  };
};

export { repeatBasic, repeatAdvanced };
