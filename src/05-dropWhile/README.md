# 5. `Easy` dropWhile

## 🔸 題目描述

請實作一個 `dropWhile` 函式，此函式接受 2 個參數：

- `array`：可以是任何類型的陣列
- `predicate` 函式：對 `array` 中的元素迭代，如果返回為 truthy value，則捨棄該元素，反之 falsy value 會被留下

`dropWhile` 返回一個新的陣列，且不應改動到原始陣列。其中包含原始陣列的切片，不包括從頭開始被丟棄的元素。

```javascript
// 範例一
dropWhile([1, 2, 3, 4, 5, 6], (value) => value < 4);
// => [4, 5, 6]

// 範例二
dropWhile([0, 1, 2], (value) => value < 5);
// => []
```

## 💭 分析與思路

理解題目後其實有點像 filter 的反向操作，如果熟悉 Array methods 基本上可以直接一行秒殺：

```ts
const dropWhile = <T>(array: T[], predicate: (arg: T) => boolean) =>
  array.filter((a) => !predicate(a));
```

另外也附上拆解版：

1. 先依照題目做 TS 定型：

   - `array` 定義為泛型 `T` 的陣列，可接受各種同型別的陣列
   - predicate 為可接受 `T` 型別的函式，並返回 boolean 值
   - 函式返回值 `result` 為另一個 `T[]` 會搜集 falsy value 們

```ts
const dropWhile = <T>(array: T[], predicate: (arg: T) => boolean) => {
  const result: T[] = [];

  return result;
};
```

2. 對 array 去迭代，若經 `predicate` 判定為 false 的值，則放到 result 中，就完工了：

```ts
const dropWhile = <T>(array: T[], predicate: (arg: T) => boolean) => {
  const result: T[] = [];

  array.forEach((a) => {
    if (!predicate(a)) {
      result.push(a);
    }
  });

  return result;
};
```

但其實我猜這題可能會限制不能用 Array methods，那麼用最陽春的 for 或 while 也能解，基本上跟 forEach 寫法類似。

## 📝 單元測試

另外稍微寫個單元測試驗證一下原陣列是否仍被保留，以及各種型別陣列都能正確運作：

```ts
import { describe, expect, it } from 'vitest';
import dropWhile from './dropWhile';

describe('dropWhile', () => {
  it('should drop elements from the array while the predicate returns true', () => {
    const array = [1, 2, 3, 4, 5, 6];
    const predicate = (x: number) => x < 4;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([4, 5, 6]);
    expect(array).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should return empty array if the predicate returns true for all elements', () => {
    const array = [1, 2, 3];
    const predicate = (x: number) => x < 5;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([]);
    expect(array).toEqual([1, 2, 3]);
  });

  it('string array should work', () => {
    const array = ['a', 'b', 'c', 'd', 'e', 'f'];
    const predicate = (x: string) => ['a', 'b', 'c'].includes(x);

    const result = dropWhile(array, predicate);

    expect(result).toEqual(['d', 'e', 'f']);
    expect(array).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
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
      { name: 'b', age: 2 },
      { name: 'c', age: 3 },
      { name: 'd', age: 4 },
      { name: 'e', age: 5 },
      { name: 'f', age: 6 },
    ];
    const predicate = (x: { name: string; age: number }) => x.age < 4;

    const result = dropWhile(array, predicate);

    expect(result).toEqual([
      { name: 'd', age: 4 },
      { name: 'e', age: 5 },
      { name: 'f', age: 6 },
    ]);
    expect(array).toEqual([
      { name: 'a', age: 1 },
      { name: 'b', age: 2 },
      { name: 'c', age: 3 },
      { name: 'd', age: 4 },
      { name: 'e', age: 5 },
      { name: 'f', age: 6 },
    ]);
  });
});
```
