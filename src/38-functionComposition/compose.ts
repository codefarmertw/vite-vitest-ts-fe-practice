type FunctionItem<T> = (x: T) => T;

const compose = <T>(functions: FunctionItem<T>[]) => {
  const reversedFunList = [...functions].reverse();

  return (x: T) => reversedFunList.reduce<T>((sum, fn) => fn(sum), x);
};

export default compose;
