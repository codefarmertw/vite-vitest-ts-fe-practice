interface Array<T> {
  at(index: number): T | undefined;
}

// 處理小數，注意若為負數，則需取 Math.ceil
const floatingToInteger = (num: number) => (num < 0 ? Math.ceil(num) : Math.floor(num));

Array.prototype.at = function <I, T>(index: I): T | undefined {
  // 處理小數及非數字轉型
  let indexState = Math.trunc(Number(index));
  console.log(indexState);

  // 處理負數
  if (indexState < 0) {
    indexState += this.length;
  }

  // 處理應被轉成 0 的 index
  if (Number.isNaN(indexState)) {
    indexState = 0;
  }

  return this[indexState];
};


