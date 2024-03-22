// solution 1. - basic
// 拆解版
const difference1 = <T>(arr1: T[], arr2: T[]): T[] => {
  const res: T[] = [];

  // 對 arr1 迭代
  arr1.forEach((a) => {
    // 去檢查 arr1 中的每個值不在 arr2 中
    if (!arr2.includes(a)) {
      res.push(a);
    }
  });

  return res;
};

// solution 2. - basic with filter
const difference2 = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter((item) => !arr2.includes(item));
};

// solution 3. - Set
const difference3 = <T>(arr1: T[], arr2: T[]): T[] => {
  const blacklist = new Set(arr2);
  return arr1.filter((item) => !blacklist.has(item));
};

export { difference1, difference2, difference3 as default };
