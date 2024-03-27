# 14. `Easy` 手寫 lodash.findIndex

## 🔸 題目描述

手寫 `findIndex` 的函式，它會接受三個參數：

- `array`： 要搜索的陣列
- `predicate`： 測試函式，用於判斷元素是否符合所需條件
- `fromIndex`： 搜索的起始索引，如果未指定，則默認為 0

`findIndex` 函式，會返回陣列中第一個滿足 `predicate` 函式的元素的索引。如果找不到符合條件的元素，則返回 `-1`。

```javascript
findIndex(array, predicate, [(fromIndex = 0)]);

findIndex([1, 13, 7, 54], (num: number) => num > 10)) // 1
findIndex([1, 13, 7, 54], (num: number) => num > 200)) // -1
```

## 💭 分析與思路

### 問題釐清

跟 array method 中的 `findIndex` 不同的是有第三個參數，是 `lodash.findIndex` 的版本，確認一些邊界條件：

- 若 `fromIndex` 大於陣列長度，則回傳 -1 嗎
- 若 `fromIndex` 小於 0，則回傳 -1 嗎
- `predicate` 不合法，則回傳 -1 嗎

### 提出測試案例

- 基本型別如 string 陣列、number 陣列能通過
- `fromIndex` 邊界條件測資
- array of object 測資能通過
- 不合法的 predicate

```ts
import { describe, expect, it } from 'vitest';
import findIndex from './findIndex';

describe('lodash.findIndex', () => {
  it('basic usage: number array', () => {
    const array = [5, 2, 4, 1, 3];
    const predicate1 = (value: number) => value > 2;
    const predicate2 = (value: number) => value > 7;

    expect(findIndex(array, predicate1)).toBe(0);
    expect(findIndex(array, predicate1, 1)).toBe(2);
    expect(findIndex(array, predicate2)).toBe(-1);
  });

  it('basic usage: string array', () => {
    const array = ['a', 'b', 'd', 'd', 'e'];
    const predicate1 = (value: string) => value === 'd';
    const predicate2 = (value: string) => value === 'f';

    expect(findIndex(array, predicate1)).toBe(2);
    expect(findIndex(array, predicate2)).toBe(-1);
  });

  it('basic usage: object array', () => {
    const array = [
      { name: 'a', age: 1 },
      { name: 'b', age: 2 },
      { name: 'c', age: 3 },
    ];
    const predicate1 = (value: { name: string; age: number }) => value.age > 2;
    const predicate2 = (value: { name: string; age: number }) => value.age > 7;

    expect(findIndex(array, predicate1)).toBe(2);
    expect(findIndex(array, predicate2)).toBe(-1);
  });

  it('edge cases: array is empty', () => {
    expect(findIndex([], () => true)).toBe(-1);
  });

  it('edge cases: fromIndex not in the range', () => {
    const array = [1, 2, 3, 4, 5];
    const predicate = (value: number) => value > 2;

    expect(findIndex(array, predicate, -1)).toBe(-1);
    expect(findIndex(array, predicate, 6)).toBe(-1);
  });
});
```

### 提出思路

- 用 TypeScript 定義輸入輸出型別，其中 predicate 定義為 function 型別並可同 [Array.findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex#callbackfn) 一樣為 element、index、array 的輸入
- 排除 `fromIndex` 的邊界條件，fromIndex 範圍介於 0 到 array 長度，否則直接回傳 -1
- 對 array 去迭代，並確認 predicate 是否回傳 truthy value，有則 return 當前 index
- 若迭代完都尚未 return，回傳 -1

```ts
// 定義型別
const findIndex = <T>(
  array: T[],
  predicate: (element: T, index?: number, array?: T[]) => boolean,
  fromIndex = 0
) => {
  // 處理 fromIndex 邊界條件

  // 迭代 array 陣列，當 predicate 遇到 truthy value 則回傳當前 index

  // 迭代完都尚未回傳，則回傳 -1 視為沒找到
  return -1;
};
```

### 實作

```ts
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
```
