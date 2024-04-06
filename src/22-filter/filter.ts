// v1. with for loop
const filter = <T>(arr: T[], fn: (n: T, i: number) => boolean) => {
  const res: T[] = [];

  // 用 for 迴圈對 arr 迭代，並執行 fn 確認是否為 truthy，是的話則放入準備回傳的結果陣列
  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i], i)) {
      res.push(arr[i]);
    }
  }

  return res;
};

// v2. with reduce
const filterWithReduce = <T>(arr: T[], fn: (n: T, i: number) => boolean) => {
  return arr.reduce<T[]>((accu, curr, index) => {
    if (fn(curr, index)) {
      accu.push(curr);
    }

    return accu;
  }, []);
};

export { filter as default, filterWithReduce };
