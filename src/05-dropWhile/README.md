# 5. `Easy` dropWhile

## 🔸 題目描述

請實作一個 `dropWhile` 函式，此函式接受 2 個參數：
- `array`：可以是任何類型的陣列
- `predicate` 函式：依序接受 `array` 中的元素，如果返回為 truthy value，則表示該元素應被丟棄，直到返回的為 falsy value 則停止

`dropWhile` 會回傳一個新的陣列，且不應改動到原始陣列。回傳的陣列從原始陣列的第一個不滿足 predicate 條件的元素開始，直到陣列中的最後一個元素，若每個元素皆滿足 predicate 函式，則回傳空陣列

```javascript
// 範例一
dropWhile([1, 2, 3, 4, 5, 6], (value) => value < 4);
// => [4, 5, 6]

// 範例二
dropWhile([0, 1, 2], (value) => value < 5);
// => []

// 範例三
dropWhile([0, 6, 1, 2], (value) => value < 5))
// => [6, 1, 2]
```

## 💭 分析與思路

結果沒仔細看群組內討論也誤解原題目意思，以為用 filter 秒殺就完成了。結果原來這個 slice 跟 predicate 別有含意，其中單看範例三更好的理解題目要的樣子

也就是題目要的是將 `array` 中的值依序去用 `predicate` 判斷條件，當找到 falsy value 後往前切一刀，把包含該值之後的陣列輸出，但不能改變原陣列

1. 先依照題目做 TS 定型：

   - `array` 定義為泛型 `T` 的陣列，可接受各種同型別的陣列
   - predicate 函式看起來原本 lodash 的做法是能接受三個參數 `value, index, array` ，並返回 boolean 值
   - 函式返回值 `result` 為另一個 `T[]` 會是執行後 slice 的結果

```ts
const dropWhile = <T>(
  array: T[],
  predicate: (value: T, index?: number, array?: T[]) => boolean
) => {
  const result: T[] = [];

  return result;
};
```

2. 對 array 去迭代，當經 `predicate` 抓到 falsy value 時，將 slice 結果放到 result 中就完工了：

```ts
const dropWhile = <T>(
  array: T[],
  predicate: (value: T, index?: number, array?: T[]) => boolean
) => {
  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i], i, array)) {
      result.push(...array.slice(i));
      break;
    }
  }

  return result;
};
```

當然使用 while 或是其他的 Array method 也可以，這裡就不贅述。

## ✅ 單元測試

另外一樣用單元測試確認一下不同型別、邊界條件以及原陣列是否沒被改到：

```ts
import { describe, expect, it } from 'vitest';
import dropWhile from './dropWhile';

describe('dropWhile', () => {
  it('should return slice of the array while the predicate returns false', () => {
    const array = [0, 6, 1, 2, 3, 4];
    const predicate = (x: number) => x < 5;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([6, 1, 2, 3, 4]);
    expect(array).toEqual([0, 6, 1, 2, 3, 4]);
  });

  it('should return empty array if the predicate returns true for all elements', () => {
    const array = [1, 2, 3];
    const predicate = (x: number) => x < 5;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([]);
    expect(array).toEqual([1, 2, 3]);
  });

  it('string array should work', () => {
    const array = ['a', 'b', 'x', 'y', 'z', 'c', 'b'];
    const predicate = (x: string) => ['a', 'b', 'c'].includes(x);

    const result = dropWhile(array, predicate);

    expect(result).toEqual(['x', 'y', 'z', 'c', 'b']);
    expect(array).toEqual(['a', 'b', 'x', 'y', 'z', 'c', 'b']);
  });

  it('should return empty array if the array is empty', () => {
    const array: number[] = [];
    const predicate = (x: number) => x < 5;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([]);
  });

  it('object array should work', () => {
    const array = [
      { name: 'a', age: 1 },
      { name: 'w', age: 6 },
      { name: 'x', age: 5 },
      { name: 'y', age: 1 },
      { name: 'z', age: 2 },
      { name: 'b', age: 3 },
    ];
    const predicate = (x: { name: string; age: number }) => x.age < 4 && x.name !== 'w';

    const result = dropWhile(array, predicate);

    expect(result).toEqual([
      { name: 'w', age: 6 },
      { name: 'x', age: 5 },
      { name: 'y', age: 1 },
      { name: 'z', age: 2 },
      { name: 'b', age: 3 },
    ]);
    expect(array).toEqual([
      { name: 'a', age: 1 },
      { name: 'w', age: 6 },
      { name: 'x', age: 5 },
      { name: 'y', age: 1 },
      { name: 'z', age: 2 },
      { name: 'b', age: 3 },
    ]);
  });
});
```

## ✨ 關於 predicate

後記一下這個 `predicate` 之前也沒聽過，查了一下資料理解，中文有人翻作「謂詞」或「斷言」，但想說那跟測試中的 `assertion` 是同個定義嗎，沒查到什麼資料的狀況下問了 Gemini Advanced，給出了以下解釋：

- 在程式設計中，`predicate` 通常用於過濾資料或檢查資料是否符合某個條件。例如，我們可以使用 `predicate` 來過濾掉陣列中的所有偶數，或者檢查一個字串是否為空字串。
- `Assertion` 也用於判斷某個東西是否符合某個條件，但它通常用於測試程式碼。例如，我們可以使用 `assertion` 來檢查一個函數是否返回了預期的結果。

簡單來說 predicate 其實就是指 Array method 中那串拿來過濾資料的條件函式：

```javascript
const arr = [1, 2, 3, 4, 5];
const oddArr = arr.filter((a) => a % 2 === 1);
```

另外也可以參考 lodash 中的 `_.dropWhile` [說明](https://lodash.com/docs/4.17.15#dropWhile)可以從原文理解：

- Creates a slice of `array` excluding elements dropped from the beginning.
- Elements are dropped until `predicate` returns falsy value.
- The predicate is invoked with three arguments: _(value, index, array)_.」
