// 為求單純，用 TypeScript 限縮輸入 pairs 的型別需為二維陣列
const fromPairs1 = <T>(pairs: T[][]) => {
  // 用 reduce 處理 pairs 並作為最後回傳結果，結果的型別會是一個以 string 當 key 的 object
  return pairs.reduce<Record<string | symbol, T>>((accu, curr) => {
    // 若 length < 2，則濾掉
    if (curr.length < 2) {
      return accu;
    }

    const [key, value] = curr;

    if (typeof key === 'symbol') {
      // 若 key 是 symbol， 則直接使用
      accu[key] = value;
    } else {
      // 強制將其他型別的 key 轉成字串
      accu[String(key)] = value;
    }

    return accu;
  }, {});
};

const fromPairs2 = <T>(pairs: T[][]) => Object.fromEntries(pairs)

const fromPairs3 = <T>(pairs: T[][]) => {
  const result: Record<string | symbol, T> = {};

  for (const [key, value] of pairs) {
    if (typeof key === 'symbol') {
      result[key] = value;
    } else {
      result[String(key)] = value;
    }
  }

  return result;
};

export {
  fromPairs1,
  fromPairs2,
  fromPairs3
};
