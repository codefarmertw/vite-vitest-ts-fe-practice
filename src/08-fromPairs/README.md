# 08. `Easy` 手寫 lodash.fromPairs

## 🔸 題目描述

實作一個 `fromPairs` 函式。 `fromPairs` 會接受一個參數 `pairs`，這個參數是一個包含多個兩元素子陣列的陣列。每個子陣列代表一個鍵值對 (key-value pair)，其中第一個元素是鍵 (key)，第二個元素是值 (value)。

`fromPairs` 最後會返回一個新的物件，每個來自 `pairs` 陣列的鍵值對(key-value pair)，都會是這個新物件的鍵值對(key-value pair)。

```javascript
// 範例
const pairs = [
  ['code', 'farmer'],
  ['try', 'to'],
  ['keep', 'growing'],
];

fromPairs(pairs);
// => { code: 'farmer', try: 'to', keep: 'growing' }
```

## 💭 分析與思路

### 問題釐清

- 需要考慮 key 的型別問題嗎
- 需要濾掉不能當作 key 的陣列嗎
- 需要做非二維陣列結構輸入的防呆嗎
- 需要對第二層陣列不滿兩個值做防呆嗎

### 提出測試案例

- 先定義題目一定要是二維陣列，排除相關 edge case
- 基本字串二維陣列能輸出正確物件
- 濾掉不能當作 key 的陣列，如 null、undefined
- 若 key 為 number，轉成字串
- 濾掉第二層陣列不滿 2 個值做防呆

```ts
import { describe, expect, it } from 'vitest';
import fromPairs from './fromPairs';

describe('lodash.fromPairs', () => {
  it('should return an object in basic usage', () => {
    const pairs = [
      ['code', 'farmer'],
      ['try', 'to'],
      ['keep', 'growing'],
    ];

    expect(fromPairs(pairs)).toEqual({ code: 'farmer', try: 'to', keep: 'growing' });
  });

  it('should filter out invalid key', () => {
    const pairs = [
      [null, 'null'],
      [undefined, 'undefined'],
      [0, 'zero'],
      [3.14, 'floating number'],
    ];

    expect(fromPairs(pairs)).toEqual({ '0': 'zero', '3.14': 'floating number' });
  });

  it('should filter out invalid value at second level', () => {
    const pairs = [['code', 'farmer'], ['try'], ['keep', 'growing']];

    expect(fromPairs(pairs)).toEqual({ code: 'farmer', keep: 'growing' });
  });
});
```

### 提出思路

- 因前面定義輸入一定是二維陣列，用 TypeScript 擋掉部分非法輸入
- 最直覺做法是對輸入陣列迭代並用 `reduce` 組出目標物件
- 在 reduce 裡判斷各種要過濾及轉型的條件

### 實作

```ts
// 為求單純，用 TypeScript 限縮輸入 item 的型別需為二維陣列
const fromPairs = <T>(item: T[][]) => {
  // 用 reduce 處理 item 並作為最後回傳結果，結果的型別會是一個以 string 當 key 的 object
  return item.reduce<Record<string, T>>((accu, curr) => {
    // 若 length < 2，則濾掉
    if (curr.length < 2) {
      return accu;
    }

    const [key, value] = curr;

    // 若 key 為 number 則轉型 string
    if (typeof key === 'number') {
      accu[key.toString()] = value;
    } else if (typeof key === 'string') {
      accu[key] = value;
    }

    return accu;
  }, {});
};
```

## 進階問題

後來看到解答中有用了一個過去中沒用過的 Object 方法 `Object.fromEntries` ，看了一下完全就是在做這題的需求，也實際拿來跑了單元測試後發現其實他也能處理 falsy value，像是 `undefined` 當 key 時會被轉成 `“undefined“`

所以調整原本的測試案例為：

```ts
it('should filter out invalid key', () => {
  const pairs = [
    [null, 'null'],
    [undefined, 'undefined'],
    [0, 'zero'],
    [3.14, 'floating number'],
  ];

  expect(fromPairs(pairs)).toEqual({
    null: 'null',
    undefined: 'undefined',
    '0': 'zero',
    '3.14': 'floating number',
  });
});
```

另外也補上可以用 Symbol 當 key 的測試案例：

```ts
it('should process key with Symbol', () => {
  const pairs = [
    [Symbol.for('symbol'), 'symbol1'],
    [Symbol.for('symbol'), 'symbol2'],
  ];

  expect(fromPairs(pairs)).toEqual({
    [Symbol.for('symbol')]: 'symbol1',
    [Symbol.for('symbol')]: 'symbol2',
  });
});
```

這是查了一下如果是 Symbol 的狀況該怎麼測，看單純只有 Symbol 的狀況是不能被當作 key 的，需要用 `Symbol.for` 才可以，但實測了一下 `Symbol.for` 與 `Symbol` 兩著用 typeof 去判斷都是 `”symbol”` ，所以假如真的用 `Symbol(‘foo‘)` 去當 key，暫時還沒找到解法，這裡先就只處理單純傳入 `Symbol.for(‘foo‘)` 的版本：

```ts
// 為求單純，用 TypeScript 限縮輸入 pairs 的型別需為二維陣列
const fromPairs = <T>(pairs: T[][]) => {
  // 用 reduce 處理 pairs 並作為最後回傳結果，結果的型別會是一個以 string 當 key 的 object
  return pairs.reduce<Record<string | symbol, T>>((accu, curr) => {
    // 若 length < 2，則濾掉
    if (curr.length < 2) {
      return accu;
    }

    const [key, value] = curr;

    if (typeof key === 'symbol') {
      // 若 key 是 symbol， 則直接使用
      accu[key] = value;
    } else {
      // 強制將其他型別的 key 轉成字串
      accu[String(key)] = value;
    }

    return accu;
  }, {});
};
```

另外發現用 `for…of` 更簡潔，也改寫看看：

```ts
const fromPairs3 = <T>(pairs: T[][]) => {
  const result: Record<string | symbol, T> = {};

  for (const [key, value] of pairs) {
    if (typeof key === 'symbol') {
      result[key] = value;
    } else {
      result[String(key)] = value;
    }
  }

  return result;
};
```
