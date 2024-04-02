const chunk = <T>(array: T[], size: number) => {
  // 處理邊界條件輸入回傳空陣列
  if (size <= 0 || Number.isNaN(size) || array.length < size) {
    return [];
  }

  // 用一個 buffer array 存未達 size 的結果
  let buffer: T[] = [];

  // 對 array 用 reduce 做迭代
  return array.reduce<T[][]>((accu, curr, index) => {
    buffer.push(curr);

    // 滿足這兩種狀況則推入結果陣列並清空 buffer
    if (buffer.length === size || index === array.length - 1) {
      accu.push([...buffer]);

      buffer = [];
    }

    return accu;
  }, []);
};

export default chunk;
