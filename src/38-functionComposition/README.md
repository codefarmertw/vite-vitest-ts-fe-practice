# 38. `Easy` Function Composition

## 🔸 題目描述

給定一個函式陣列 `[f1, f2, f3, ... fn]`，回傳一個新的函式 `fn`，它是該陣列中函式的組合。

函式組合的定義是，如果函式陣列為 `[f(x), g(x), h(x)]` ，則 `fn(x) = f(g(h(x)))`。空函式陣列的函式組合則為恆等函式 `f(x) = x`。

你可以假設陣列中的每個函式都接受一個整數作為輸入，並回傳一個整數作為輸出。

```javascript
// 範例一
輸入: functions = [x => x + 1, x => x * x, x => 2 * x], x = 4
輸出: 65
解說:
從右到左
初始的 x = 4.
2 * (4) = 8
(8) * (8) = 64
(64) + 1 = 65

// 範例二
輸入: functions = [x => 10 * x, x => 10 * x, x => 10 * x], x = 1
輸出: 1000
解說:
從右到左
10 * (1) = 10
10 * (10) = 100
10 * (100) = 1000
```

## 💭 分析與思路

### 問題釐清

- x 是否需要考慮 number 外的型別？
- 是否需要處理在過程中輸出不滿足下一個 function 輸入的處理
- function array 中的每個輸入參數是否都只有一個

### 提出測試案例

- 為了讓問題簡化，這邊先只允許每個 function 都只有一個 number 參數，且初始 x 需為 number

### 提出思路

```ts
// 定義型別
type FunctionItem = (x: number) => number;

const compose = (functions: FunctionItem[]): FunctionItem => {
  // 複製一份 functions 陣列並做 reverse
  // 輸出能回傳一個以 (x: number) ⇒ number 形式的 function
  // 對已反轉的函式陣列去取 reduce 迭代執行相加的結果
};
```

### 實作

```ts
const compose = (functions: FunctionItem[]): FunctionItem => {
  /**
   * 對 functions 複製一份並用 reverse 反轉，方便後面可以從頭取出
   * 注意 reverse 會改變原陣列
   * 所以為了避免 input 中的 functions 被更動
   * 這裡需要複製一份
   */
  const reversedFunList = [...functions].reverse();

  // 輸出能回傳一個以 (x: number) ⇒ number 形式的 function
  // 對已反轉的函式陣列去取 reduce 迭代執行相加的結果
  return (x: number) =>
    reversedFunList.reduce<number>((sum, fn) => {
      sum = fn(sum);
      return sum;
    }, x);
};
```

整理一下後這樣更簡潔：

```ts
const compose = (functions: FunctionItem[]): FunctionItem => {
  const reversedFunList = [...functions].reverse();

  return (x: number) => reversedFunList.reduce<number>((sum, fn) => fn(sum), x);
};
```

如果去掉型別與縮寫後其實可以變成一行 code，但其實沒有很好讀就是 😆：

```javascript
const compose = (functions) => (x) => [...functions].reverse().reduce((sum, fn) => fn(sum), x);
```

## 進階

如果放寬不只是 number 的測資呢？其實最後發現也沒什麼差，就是改一下型別成泛型而已：

```ts
type FunctionItem<T> = (x: T) => T;

const compose = <T>(functions: FunctionItem<T>[]) => {
  const reversedFunList = [...functions].reverse();

  return (x: T) => reversedFunList.reduce<T>((sum, fn) => fn(sum), x);
};
```

也補了一些測資：

```ts
import { describe, expect, test } from 'vitest';
import compose from './compose';

const basicCases = [
  {
    input: [(x: number) => x + 1, (x: number) => x * x, (x: number) => 2 * x],
    x: 4,
    expected: 65,
  },
  {
    input: [(x: number) => 10 * x, (x: number) => 10 * x, (x: number) => 10 * x],
    x: 1,
    expected: 1000,
  },
  {
    input: [],
    x: 5,
    expected: 5,
  },
];

const advancedCases = [
  {
    input: [
      (x: string) => `${x} - ${x}`,
      (x: string) => x.toUpperCase(),
      (x: string) => x + 12345,
    ],
    x: 'hello',
    expected: 'HELLO12345 - HELLO12345',
  },
  {
    input: [
      (x: { name: string; age: number }) => ({
        name: `${x.name} is so old!`,
        age: x.age * 2,
      }),
      (x: { name: string; age: number }) => ({
        name: `HELLO, ${x.name}`,
        age: x.age * 2,
      }),
      (x: { name: string; age: number }) => ({
        name: x.name.toUpperCase(),
        age: x.age * 2,
      }),
    ],
    x: { name: 'codefarmer', age: 18 },
    expected: {
      name: 'HELLO, CODEFARMER is so old!',
      age: 144,
    },
  },
];

const edgeCases = [
  {
    input: [(x: number) => x * x, (x: string) => `${x}${x}${x}`, (x: number) => x + 1],
    x: 4,
    expected: 308025,
  },
  {
    input: [(x: number) => x * x, () => 987, (x: number) => x + 100],
    x: 5,
    expected: 974169,
  },
  {
    input: [() => 987, (x: number) => x + 100, (x: number) => x * x],
    x: 'hello world',
    expected: 987,
  },
  {
    input: [(x: number) => x * x, (x: string) => x.toUpperCase(), (x: null) => typeof x],
    x: null,
    expected: NaN,
  },
];

describe('function composition', () => {
  test.each(basicCases)('should pass basic test cases - %s', ({ input, x, expected }) => {
    const result = compose(input)(x);

    expect(result).toEqual(expected);
  });

  test.each(advancedCases)(
    'should pass advanced test cases - %s',
    ({ input, x, expected }) => {
      const result = compose(input)(x);

      expect(result).toEqual(expected);
    }
  );

  test.each(edgeCases)('should pass edge cases - %s', ({ input, x, expected }) => {
    const result = compose(input)(x);

    expect(result).toEqual(expected);
  });
});
```
