# 44. `Easy` 手寫 expect.toBe

## 🔸 題目描述

為了幫助開發人員測試程式碼，你需要撰寫一個 `expect` 的函式。該函式可以接受任何值 `val`，並返回一個包含以下兩個功能的物件：

- `toBe(val)` 接受另一個值，如果這兩個值相等（即 `===`），則返回 `true`。如果不相等，則會拋出一個錯誤訊息 "Not Equal"。
- `notToBe(val)` 接受另一個值，如果這兩個值不相等（即 `!==`），則返回 `true`。如果相等，則會拋出一個錯誤訊息 "Equal"。

```javascript
// 範例一
輸入: func = () => expect(5).toBe(5)
輸出: {"value": true}
解說: 5 === 5 so this expression returns true.

// 範例二
輸入: func = () => expect(5).toBe(null)
輸出: {"error": "Not Equal"}
解說: 5 !== null so this expression throw the error "Not Equal".
```

## 💭 分析與思路

### 問題釐清

- 應該是比照 testing 函式庫，`toBe` 與 `notToBe` 的實作只需比對 primitive values 就好？

### 提出測試案例

- 分別驗證 toBe、notToBe 的正反面測資

### 提出思路

- 題目蠻基本的，因為是 primitive values 的比對，所以就是在 function 內 return 一個物件包含有 `toBe` 、`notToBe` 函式分別實作比對與拋錯的邏輯就完成了

### 實作

```ts
const customExpect = <T>(val: T) => {
  return {
    toBe: (expected: T) => {
      if (val === expected) {
        return true;
      } else {
        throw new Error('Not Equal');
      }
    },
    notToBe: (expected: T) => {
      if (val !== expected) {
        return true;
      } else {
        throw new Error('Equal');
      }
    },
  };
};
```

在寫單元測試時發現如果要比對 `customExpect(5).toBe(null)` 時其實就會噴錯，因為在定義型別時就有期待 val 與 expected 都是同型別

但如果分開來寫：

```ts
const customExpect = <T, E>(val: T) => {
  return {
    toBe: (expected: E) => {
      if (val === expected) {
        return true;
      } else {
        throw new Error('Not Equal');
      }
    },
    notToBe: (expected: E) => {
      if (val !== expected) {
        return true;
      } else {
        throw new Error('Equal');
      }
    },
  };
};
```

此時 TypeScript 本身也會檢查型別的相等的合理性而噴錯：

```shell
This comparison appears to be unintentional because the types ‘T' and 'E' have no overlap.
```

除非是改成這樣，但想想其實也有點多此一舉，因為如果是只拿來做 primitive value 的比對，理論上型別本身就要一樣，不需要寫成兩個泛型：

```ts
const customExpect = <T, E extends T>(val: T) => {
  ...
};
```

也補個基本的單元測試：

```ts
import { describe, expect, test } from 'vitest';
import customExpect from './customExpect';

const testCases = [
  {
    title: 'toBe - positive case',
    assert: () => customExpect(5).toBe(5),
  },
  {
    title: 'toBe - negative case',
    assert: () => customExpect(5).toBe(10),
    expectedError: 'Not Equal',
  },
  {
    title: 'notToBe - positive case',
    assert: () => customExpect(5).notToBe(10),
  },
  {
    title: 'notToBe - negative case',
    assert: () => customExpect(5).notToBe(5),
    expectedError: 'Equal',
  },
];

describe('custom expect', () => {
  test.each(testCases)('$title', ({ assert, expectedError }) => {
    try {
      expect(assert()).toBe(true);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(expectedError);
      }
    }
  });
});
```

## ✨ 小結

今天終於也來到連續打卡的 30 天，用這題簡單的 expect 實作來做個暫時的收尾也還不錯，呼應了最一開始是想練習寫單元測試的初衷。沒想到在這麼爆炸忙的兩個月中，還能勉強苟延殘揣連打 30 天，不禁回憶起了當年寫鐵人賽的熱血。

稍微有點可惜的是還有許多有趣的 medium 題目還沒做，但因為目前工作上同時有 3 個專案在趕死線中，加上這週五另外需要準備其他主題的內容，就先打卡到這，之後忙完應該會找時間來整理一下前面寫的 💩 code，如果夠熱血的話應該會把 Medium 的挑一些有興趣的主題補完，畢竟有些是蠻經典的前端面試題，複習一下把基本功打穩也是挺好的。
