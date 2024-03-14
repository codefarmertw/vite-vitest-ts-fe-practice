# Day 01. `Easy` 手寫 clamp

## 🔸 題目描述

你正在開發一個處理數值資料的系統。請寫一個名為 `clamp` 的函式，它需要三個參數：

- 一個數值 `number`
- 一個最小值 `lower`
- 一個最大值 `upper`

此函式應確保輸出的 `number` 始終落在指定的範圍内，包括最小值和最大值本身。你會如何實作這個 `clamp` 呢?

```javascript
// 在範圍中，返回原值
clamp(7, 0, 9); // => 7

// 小於 lower，返回 lower
clamp(-12, -4, 5); // => -4

// 大於 upper，返回 upper
clamp(18, 3, 9); // => 9
```

## 💭 分析與思路

今天工作有點炸，來返璞歸真做一題簡單的，一樣先寫 test cases：

```javascript
import { describe, expect, it } from 'vitest';
import clamp from './clamp';

describe('clamp', () => {
  it('should return the number if it is within the range', () =>
    expect(clamp(7, 0, 9)).toBe(7));

  it('should return the lower bound if the number is less than the lower bound', () =>
    expect(clamp(-12, -4, 5)).toBe(-4));

  it('should return the upper bound if the number is greater than the upper bound', () =>
    expect(clamp(18, 3, 9)).toBe(9));
});
```

如果不求精簡，最直覺的做法就是 if…else 寫出來就完工了：

```ts
// solution 1. basic logic
const clampBasic = (number: number, lower: number, upper: number) => {
  if (number < lower) {
    return lower;
  } else if (number > upper) {
    return upper;
  } else {
    return number;
  }
};
```

一開始沒想到還能怎麼優化，後來不小心瞄到解答還有另一種更精簡的，看完覺得也是蠻聰明：

```ts
// solution 2. Math
const clampWithMath = (number: number, lower: number, upper: number) =>
  Math.min(Math.max(number, lower), upper);
```

對下界值與目標值取最大值後，如果目標值不在範圍內，此操作會拿到下界值，然後再用一樣的邏輯去檢查上界值。

補充，這個 clamp 是 lodash 或 underscore 工具中拿來求夾值的函式，對 native code 有興趣也可以參考這個 repo 整理了一份 [You-Dont-Need-Lodash-Underscore](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_clamp)。

## 🤔 關於單元測試

到第四天，開始覺得每天都跑 `pnpm test` 跑到不需要看的測試有點煩，所以也查了一下要怎麼優化。

目前找到兩種方式：

- 最直接的把每一題的路徑加到 package script 裡
- 用 `vitest —dir` 的方式，要 run 的時候再自己指定目標路徑

也好奇去看之前有個 Matt Pocock 的 [TypeScript 教學專案](https://github.com/total-typescript/beginners-typescript-tutorial/blob/main/package.json)怎麼做，他是採用第一種方式。

好奇有更聰明的方式嗎，歡迎留言到 issue 告訴我。
