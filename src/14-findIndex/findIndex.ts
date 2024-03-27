// 定義型別
const findIndex = <T>(
  array: T[],
  predicate: (element: T, index?: number, array?: T[]) => boolean,
  fromIndex = 0
) => {
  // 處理 fromIndex 邊界條件
  if (fromIndex < 0 || fromIndex > array.length) {
    return -1;
  }

  // 迭代 array 陣列，當 predicate 遇到 truthy value 則回傳當前 index
  for (let i = fromIndex; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }

  // 迭代完都尚未回傳，則回傳 -1 視為沒找到
  return -1;
};

export default findIndex;
