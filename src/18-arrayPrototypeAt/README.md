# 18. `Easy` 實作 Array.prototype.at

## 🔸 題目描述

請實作 `Array.prototype.at`，該方法會接受一個整數作為輸入，並從陣列中檢索相應元素。除了正整數外，也要能夠處理負整數，負整數會從陣列末尾計算。以下為使用範例

```javascript
const arr = ['code', 'farmer'];
arr.at(0); // code
arr.at(1); // farmer
arr.at(2); // undefined

arr.at(-1); // code
arr.at(-2); // farmer
arr.at(-3); // undefined
```

## 💭 分析與思路

### 問題釐清

- 如果輸入的 index 是小數怎麼處理？
  - [原生](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at#index)會只接去掉小數部分取小數
- 如何處理輸入的 index 為極端值數字或非數字型別？
  - `NaN`、`-0`、`undefined`、`null`、`object`、`function` 轉為 `0`
  - `Infinity`、`-Infinity` 會超過範圍結果為 `undefined`
  - 比較特別的是發現 `string` 與 `boolean` 有做自動轉型
  - `array` 如果只有一個值，會取該值嘗試轉型是否為合法 index，若超過一個值則視為 0

### 提出測試案例

- 能通過基本正負整數測資
- 能去掉小數部分取整數
- 能處理上述各種邊界狀況的輸入

```ts
import { describe, expect, it } from 'vitest';
import './at';

const input = ['code', 'farmer', 'tw'];
const basicCases = [
  {
    index: 1,
    expected: 'farmer',
  },
  {
    index: 3,
    expected: undefined,
  },
  {
    index: -1,
    expected: 'tw',
  },
  {
    index: -3,
    expected: 'code',
  },
  {
    index: -4,
    expected: undefined,
  },
];

const floatingNumberCases = [
  {
    index: 1.25,
    expected: 'farmer',
  },
  {
    index: 3.5,
    expected: undefined,
  },
  {
    index: -1.25,
    expected: 'tw',
  },
];

const nonNumberCases = [
  {
    index: NaN,
    expected: 'code',
  },
  {
    index: -0,
    expected: 'code',
  },
  {
    index: undefined,
    expected: 'code',
  },
  {
    index: null,
    expected: 'code',
  },
  {
    index: {},
    expected: 'code',
  },
  {
    index: Infinity,
    expected: undefined,
  },
  {
    index: -Infinity,
    expected: undefined,
  },
  {
    index: 'hello',
    expected: 'code',
  },
  {
    index: '2',
    expected: 'tw',
  },
  {
    index: false,
    expected: 'code',
  },
  {
    index: true,
    expected: 'farmer',
  },
  {
    index: [],
    expected: 'code',
  },
  {
    index: [2],
    expected: 'tw',
  },
  {
    index: [2, 3],
    expected: 'code',
  },
  {
    index: () => 2,
    expected: 'code',
  },
];

describe('rewrite Array.prototype.at practice', () => {
  it('should pass basic test cases', () => {
    basicCases.forEach(({ index, expected }) => {
      expect(input.at(index)).toBe(expected);
    });
  });

  it('should pass floating number test cases', () => {
    floatingNumberCases.forEach(({ index, expected }) => {
      expect(input.at(index)).toBe(expected);
    });
  });

  it('should pass non number test cases', () => {
    nonNumberCases.forEach(({ index, expected }) => {
      expect(input.at(index)).toBe(expected);
    });
  });
});
```

這裡可以先把 `import './at';` 註解掉，確認在還沒覆寫 at 方法前是否測資都寫對。

### 提出思路

- 先對 array.prototype 的 overwrite 定型
- 基本款處理負數去加上陣列長度，能通過第一個測試案例
- 進階版處理小數
- 最後處理各種轉型與邊界條件

```ts
interface Array<T> {
  at(index: number): T | undefined;
}

Array.prototype.at = function <T>(index: number): T | undefined {
  // 處理負數
  // 回傳當前 index 的值，若超出陣列範圍，則回傳 undefined
};
```

### 實作

依照上面思路一個個 test case 依序進階處理後得到完整版：

```ts
interface Array<T> {
  at(index: number): T | undefined;
}

// 處理小數，注意若為負數，則需取 Math.ceil
const floatingToInteger = (num: number) => (num < 0 ? Math.ceil(num) : Math.floor(num));

Array.prototype.at = function <I, T>(index: I): T | undefined {
  // 處理小數及非數字轉型
  let indexState = floatingToInteger(Number(index));
  console.log(indexState);

  // 處理負數
  if (indexState < 0) {
    indexState += this.length;
  }

  // 處理應被轉成 0 的 index
  if (Number.isNaN(indexState)) {
    indexState = 0;
  }

  return this[indexState];
};

```

簡單筆記一下處理：

- 其實看了一下 TC39 原始定義 index 是有限制為 number，但想說前面都列好 test case 了，順便練習一下
- 另外寫一個 `floatingToInteger` 去取整數，透過 test case 發現如果在取整數時，也要注意負數問題，要娶另一邊
- 轉型的部分其實最精簡可以在一開始就對 index 用 `Number()` 處理，最後判斷 `isNaN` 轉成 0 即可
- 補充：發現原來 `Number([‘2’])` 會被轉成 2，頗酷

後來去看了一下 [polyfill 裡的寫法](https://github.com/tc39/proposal-relative-indexing-method?tab=readme-ov-file#polyfill)，學到原來處理小數這段可以用 `Math.trunc` 取代，長知識了
