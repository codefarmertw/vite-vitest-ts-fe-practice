# 06. `Easy` 手寫 lodash.dropRightWhile

## 🔸 題目描述

請實作一個名為 `dropRightWhile` 的函式，該函式接收兩個參數。第一個參數是一個陣列；第二個參數是一個 predicate 函式，用於指定條件。

`dropRightWhile` 函式會從陣列的末端開始遍歷，移除符合指定條件的元素，直到遇到不符合條件的元素為止。然後，它會回傳剩餘的元素所組成的新陣列，同時確保原始陣列保持不變。

```javascript
// 範例一
dropRightWhile(['hello', 'world', 'today', 'isGood'], (value) => value.length > 5);
// => ['hello', 'world', 'today']

// 範例二
dropRightWhile(
  [
    { name: 'Alice', age: 25 },
    { name: 'Charlie', age: 20 },
    { name: 'Bob', age: 30 },
  ],
  (obj) => obj.age > 25
);
// => [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 20 }]

// 範例三
dropRightWhile([10, 20, 30, 40, 50, 10], (value) => value !== 10);
// => [10, 20, 30, 40, 50, 10]

// 範例四
dropRightWhile([1], (value) => value > 0);
// => []
```

## 💭 分析與思路

跟前一題 dropWhile 的概念類似，差異只在要從陣列末端取回來，因此直覺上的思路只要調整一下 for 迴圈的 index 順序即可

先根據題目列出單元測試案例：

```ts
import { describe, expect, it } from 'vitest';
import dropRightWhile from './dropRightWhile';

describe('dropRightWhile', () => {
  it('should drop elements from the end of the array until the predicate returns false', () => {
    expect(
      dropRightWhile(['hello', 'world', 'today', 'isGood'], (value) => value.length > 5)
    ).toEqual(['hello', 'world', 'today']);

    expect(
      dropRightWhile(
        [
          { name: 'Alice', age: 25 },
          { name: 'Charlie', age: 20 },
          { name: 'Bob', age: 30 },
        ],
        (obj) => obj.age > 25
      )
    ).toEqual([
      { name: 'Alice', age: 25 },
      { name: 'Charlie', age: 20 },
    ]);

    expect(dropRightWhile([10, 20, 30, 40, 50, 10], (value) => value !== 10)).toEqual([
      10, 20, 30, 40, 50, 10,
    ]);

    expect(dropRightWhile([1], (value) => value > 0)).toEqual([]);
  });
});
```

先對輸入輸出定型後，依照 dropWhile 的邏輯反向做回去，但要特別注意 index 的邊界值：

```ts
const dropRightWhile = <T>(
  array: T[],
  predicate: (value: T, index?: number, array?: T[]) => boolean
) => {
  const result: T[] = [];

  // 從陣列的最後一個元素開始往回迭代
  for (let i = array.length - 1; i > 0; i--) {
    if (!predicate(array[i], i, array)) {
      // 當在 predicate 遇到 falsy value 則對原陣列切片取值
      result.push(...array.slice(0, i + 1));
      break;
    }
  }

  return result;
};
```
