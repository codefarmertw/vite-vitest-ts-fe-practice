# 20. `Easy` 實作 lodash.chunk

## 🔸 題目描述

Lodash 的 `chunk` 是開發中經常被用的效用函式，也經常會在面試被問到。 `chunk` 能將輸入的陣列分割成指定長度的小組。並輸出一個新的陣列，包含原始陣列的元素，並按指定的 `size` 分組成子陣列。

```javascript
const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const chunkSize = 3;

// 輸出: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
const chunkedArray = chunkArray(originalArray, chunkSize);
```

## 💭 分析與思路

### 問題釐清

- size 為 0、NaN、負數如何處理？
- 如果原陣列長度不足 size，則輸出空陣列嗎？
- 空陣列的輸入，期待的輸出是空陣列？

### 提出測試案例

- 能通過基本測資
- 輸出能是新的陣列
- 檢查輸入的原始陣列為二維陣列的狀況
- 檢查物件陣列的輸入
- 非法 size、原陣列長度不足 size、空陣列輸入，則輸出空陣列

```ts
import { describe, expect, test } from 'vitest';
import chunk from './chunk';

const basicCases = [
  {
    input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    size: 3,
    expected: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]],
  },
  {
    input: [1, 2, 3, 4, 5, 6],
    size: 1,
    expected: [[1], [2], [3], [4], [5], [6]],
  },
  ...
];

const edgeCases = [
  {
    input: [1, 2, 3],
    size: 0,
    expected: [],
  },
  {
    input: [1, 2, 3, 4, 5],
    size: 6,
    expected: [],
  },
  {
    input: [1, 2, 3],
    size: -1,
    expected: [],
  },
  {
    input: [],
    size: 1,
    expected: [],
  },
  {
    input: [1, 2, 3],
    size: NaN,
    expected: [],
  },
];

describe('lodash.chunk', () => {
  test.each(basicCases)(
    'should pass basic test cases - %s',
    ({ input, size, expected }) => {
      const result = chunk(input, size);

      expect(result).toEqual(expected);
      expect(result).not.toBe(input);
    }
  );

  test.each(edgeCases)('should pass edge cases - %s', ({ input, size, expected }) => {
    const result = chunk(input, size);

    expect(result).toEqual(expected);
    expect(result).not.toBe(input);
  });
});
```

### 提出思路

- 對 chunk 陣列輸入用 TS 定型
- 處理邊界條件輸入回傳空陣列
- 用一個 buffer array 搭 reduce 去迭代對陣列切塊

```ts
const chunk = <T>(array: T[], size: number) => {
  // 處理邊界條件輸入回傳空陣列
  // 用一個 buffer array 存未達 size 的結果
  // 對 array 用 reduce 做迭代
};
```

### 實作

```ts
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
```

做完後看了解法原來也可以用 slice 更簡潔一些，也筆記起來：

```javascript
function chunk(array, size) {
  const chunkedArray = [];

  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }

  return chunkedArray;
}
```
