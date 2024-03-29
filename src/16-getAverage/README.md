# 16. 計算陣列中所有數字的平均數

## 🔸 題目描述

給定一個含有數字的陣列，例如 `[10, 20, 30, 40, 50]`，寫一個函式來計算這個陣列的平均數。

```javascript
const arr = [10, 20, 30, 40, 50];

getAverage(arr); // 30
```

## 💭 分析與思路

TGIF，今天放過自己來一題秒殺題：

### 實作

```ts
const getAverage = (array: number[]): number => {
  // 多補一個空陣列回傳 0 的條件
  if (array.length === 0) {
    return 0;
  }

  return array.reduce((accu, curr) => accu + curr, 0) / array.length;
};
```

### 測試案例

```ts
import { expect, it } from 'vitest';
import getAverage from './getAverage';

const testCases = [
  [[0, -1, 2, -3, 4, -5], [-0.5]],
  [[1.25, 2.5, 3.75, 5.9], [3.35]],
  [[NaN, NaN], [NaN]],
  [[Infinity, -Infinity], [NaN]],
  [[], [0]],
];

it('get array average', () => {
  testCases.forEach(([input, expected]) => {
    expect(getAverage(input)).toEqual(expected[0]);
  });
});
```

寫測試時， expected 的值一開始設成 number，害 input 值會被判定為 `number | number[]` 的型別，所以還是要包一層。
