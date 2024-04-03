# 21. `Easy` 實作 Array.map

## 🔸 題目描述

給定一個只有整數的陣列 `arr` ，以及一個函式 `fn`；要返回一個新的陣列，新陣列的每個元素都需要套用 `fn` ，讓回傳的陣列會成為 `returnedArray[i] = fn(arr[i], i)`。本題不得使用 JavaScript 內建的 [`Array.map`](Array.map) 方法來解。

```javascript
// 範例一
輸入: arr = [1,2,3], fn = function plusone(n) { return n + 1; }
輸出: [2,3,4]
解說:
const newArray = map(arr, plusone); // [2,3,4]
該函式將陣列中的每個值都增加一

// 範例二
輸入: arr = [1,2,3], fn = function plusI(n, i) { return n + i; }
輸出: [1,3,5]
解說: 該函式將陣列中的每個值都增加其索引的量
```

## 💭 分析與思路

### 提出測試案例

蠻單純，就是依照 [Array.map](Array.map) 的 SPEC 來做：

- 通過基本測資
- 測試物件陣列
- 測試空陣列

```ts
import { describe, expect, test } from 'vitest';
import map from './map';

const basicCases = [
  {
    input: [1, 2, 3, 4, 5, 6],
    fn: (x: number) => x * 2,
    expected: [2, 4, 6, 8, 10, 12],
  },
  {
    input: [1, 2, 3, 4, 5, 6],
    fn: (x: number, index: number) => x + index,
    expected: [1, 3, 5, 7, 9, 11],
  },
  {
    input: [
      {
        name: 'codefarmer',
        age: 18,
      },
      {
        name: 'bob',
        age: 20,
      },
      {
        name: 'alice',
        age: 22,
      },
    ],
    fn: (x: { name: string; age: number }) => ({
      name: x.name.toUpperCase(),
      age: x.age * 2,
    }),
    expected: [
      {
        name: 'CODEFARMER',
        age: 36,
      },
      {
        name: 'BOB',
        age: 40,
      },
      {
        name: 'ALICE',
        age: 44,
      },
    ],
  },
];

const edgeCases = [
  {
    input: [],
    fn: (x: number) => x + 2,
    expected: [],
  },
];

describe('Array.map', () => {
  test.each(basicCases)(
    'should pass basic test cases - %s',
    ({ input, fn, expected }) => {
      const result = map(input, fn);

      expect(result).toEqual(expected);
      expect(result).not.toBe(input);
    }
  );

  test.each(edgeCases)('should pass edge cases - %s', ({ input, fn, expected }) => {
    const result = map(input, fn);

    expect(result).toEqual(expected);
    expect(result).not.toBe(input);
  });
});
```

### 實作

用基本 for 迴圈取代即可：

```ts
const map = <T, R>(array: T[], fn: (element: T, index?: number, array?: T[]) => R) => {
  const result: R[] = [];

  for (let i = 0; i < array.length; i++) {
    result.push(fn(array[i], i, array));
  }

  return result;
};
```
