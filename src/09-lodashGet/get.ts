const castPathParam = (pathParam: string | string[]) => {
  // 確認型別是否為 string[] 若是則直接使用
  if (Array.isArray(pathParam)) {
    return pathParam;
  }

  // 若型別為字串，則用 split 來 parse 路徑，能抓出 [‘a‘, ‘0‘, ‘b‘, ‘c‘] 這樣的格式
  if (typeof pathParam === 'string') {
    // 用 split 處理 . 與 [] 分隔的字串
    return pathParam.split(/[\.\[\]]/).filter((str) => str !== '');
  }

  // 若不是 string 或 string[] 則 throw error
  throw new Error('[get] pathParam must be string or string array');
};

const get = <T, D>(object: T, pathParam: string | string[], defaultValue?: D) => {
  // 處理輸入值的 edge case
  if (!pathParam || pathParam.length === 0 || !object) {
    return defaultValue;
  }

  // 處理 pathParam
  const pathArray = castPathParam(pathParam);

  // 對上面處理完成的 pathParam 陣列從頭開始迭代，依序造訪 object 裡的 key，直到抓出目標值
  return pathArray.reduce<any>((accu, key) => {
    if (typeof accu !== 'object' || accu?.[key] === undefined) {
      return defaultValue;
    }

    return accu?.[key] ?? defaultValue;
  }, object);
};

export default get;
