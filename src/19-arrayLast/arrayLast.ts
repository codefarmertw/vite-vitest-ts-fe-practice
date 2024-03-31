interface Array<T> {
  last(): T | number;
}

Array.prototype.last = function <T>(): T | number {
  // 處理空陣列
  if (this.length === 0) {
    return -1;
  }

  // 回傳最後一個元素
  return this[this.length - 1];
};
