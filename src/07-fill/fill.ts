const fill = <T, V>(array: (T | V)[], value: V, start = 0, end = array.length) => {
  // 避免對原參數操作，另外宣告 state 存 start、end
  const state = {
    start,
    end,
  };

  // start 的負數處理
  if (start < 0) {
    state.start += array.length;

    if (state.start < 0) {
      state.start = 0;
    }
  }

  // end 的負數處理
  if (end < 0) {
    state.end += array.length;

    if (state.end < 0) {
      state.end = 0;
    }
  }

  if (end > array.length) {
    state.end = array.length;
  }

  // 對原陣列迭代並直接以 value 取代目標值
  for (let i = state.start; i < state.end; i++) {
    array[i] = value;
  }

  // 回傳原陣列
  return array;
};

export default fill;
