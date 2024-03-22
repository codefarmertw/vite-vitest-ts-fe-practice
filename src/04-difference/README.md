# 4. `Easy` 手寫 lodash.difference

## 🔸 題目描述

請實作一個名為 `difference` 的函式，該函式接收兩個陣列作為參數。函式的功能是回傳只在第一個陣列中存在、在第二個陣列中不存在的元素，並且避免對重複值進行多餘的操作。

```javascript
difference([], [])                   // []
difference([1, 1, 2, 3], [2, 3])     // [1, 1]
difference([1, 2, 3], [1, 2, 3, 4])	 // []
difference([4, 3, 2, 1], [1, 2, 3]); // [4]

```

## 💭 分析與思路

1. 先寫出單元測試：
```ts
import { describe, expect, it } from 'vitest';
import difference from './difference';

describe('difference', () => {
  it('should return an array', () => {
    expect(Array.isArray(difference([], []))).toBe(true);
  });

  it('should return an array with the difference of two arrays', () => {
    expect(difference([1, 1, 2, 3], [2, 3])).toEqual([1, 1]);
    expect(difference([1, 2, 3], [1, 2, 3, 4])).toEqual([]);
    expect(difference([4, 3, 2, 1], [1, 2, 3])).toEqual([4]);
  });

  it('edge cases', () => {
    expect(
      difference([undefined, null, 0, '0', false, NaN], [null, 0, '0', false])
    ).toEqual([undefined, NaN]);
  });
});
```

2. 依照題目需求定型：
```ts
const difference = <T>(arr1: T[], arr2: T[]): T[] => {
  const res: T[] = [];

  // write your code here

  return res;
};
```

3. 如果對 Array method 熟悉的話可以用 filter 搭 includes 秒殺，但這裡拆解一下：
```ts
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

// 秒殺版
const difference2 = <T>(arr1: T[], arr2: T[]): T[] =>
  arr1.filter((a) => !arr2.includes(a));
```

其實有在想題目中特別提到的「避免對重複值進行多餘的操作」的意思，在想應該是想要優化演算法，但看了解答後才想到原來可以對 arr2 去做 Set，去掉重複值的比對且查詢值更有效率：

```ts
const difference3 = <T>(arr1: T[], arr2: T[]): T[] => {
  const blacklist = new Set(arr2);
  return arr1.filter((item) => !blacklist.has(item));
};
```
