# Day 17. `Easy` Remove Duplicates (陣列去除重複)

## 🔸 題目描述

給定一個陣列，裡面有重複的數字。請實踐一個 `removeDuplicate` 函式，函式會接收一個參數，此參數是一個陣列，最後函式會輸出去除重複數字後的陣列。

```javascript
const originalArr = [9, 1, 2, 2, 3, 4, 2, 4, 8, 1, 9];

const ans = deduplication(originalArr);
console.log(ans); // [9, 1, 2, 3, 4, 8]
```

## 💭 分析與思路

這個題目如果熟悉 JavaScript Array methods 的話算是蠻單純的，可以很快地得到這樣的方法，先來個比較單純的拆解版：

1. 期待輸入是一個 number 陣列：

```typescript
const deduplication = (arr: number[]) => {
  // write your code here
};
```

2. 預期會得到一個輸出不重複數字的陣列，先宣告出來：

```typescript
const deduplication = (arr: number[]) => {
  const result: number[] = [];

  // deduplication logic

  return result;
};
```

3. 去對 `arr` 做 loop：

```typescript
const deduplication = (arr: number[]) => {
  const result: number[] = [];

  // deduplication logic
  arr.forEach(a => {
    ...
  })

  return result;
};
```

4. 去除重複的值，先直覺地寫判斷式，這裡有許多 array methods 可以選擇，不論是最傳統的直接再跑一個 for 迴圈，或直接用 `indexOf` 、`find` 、`some` 、`filter` 、`includes` 等等都是殊途同歸，選擇我最習慣的 `includes` 去判斷 `result` 中是否已經含有目前迭代到的數字，去進行相對應操作：

```typescript
const deduplication = (arr: number[]) => {
  const result: number[] = [];

  // deduplication logic
  arr.forEach((a) => {
    if (result.includes(a)) {
      continue;
    } else {
      result.push(a);
    }
  });

  return result;
};
```

5. 再整理一下多餘的邏輯就完成了：

```typescript
const deduplication = (arr: number[]) => {
  const result: number[] = [];

  // deduplication logic
  arr.forEach((a) => {
    if (!result.includes(a)) {
      result.push(a);
    }
  });

  return result;
};
```

6. 如果對 reduce 熟悉的話，再加上 arrow function 的簡寫還可以更精簡：

```typescript
const deduplicationWithReduce = (arr: number[]) =>
  arr.reduce<number[]>((accu, curr) => {
    if (!accu.includes(curr)) {
      accu.push(curr);
    }

    return accu;
  }, []);
```

## ✨ 其他解法

其實這題目被問到 follow-up 也是蠻常見的，像是其實 `forEach` 加 `includes` 其實算是雙層迴圈，因此複雜度是 `O(n^2)` ，如果要加速演算法效率，另一種較基本的做法是用 object 的結構：

```typescript
const deduplicationWithObject = (arr: number[]) => {
  const bufferMap: Record<number, boolean> = {};

  return arr.reduce<number[]>((accu, curr) => {
    if (!bufferMap[curr]) {
      accu.push(curr);
      bufferMap[curr] = true;
    }

    return accu;
  }, []);
};
```

因為 `bufferMap[curr]` 這行在查找目前迭代數字是否在結果陣列中時，所需的複雜度是 `O(1)` ，所以在迭代 n 次的狀況下整個 function 的複雜度降到 `O(n)`。

另外其實如果題目沒限制的話，用原生的 `Set` 結構是最簡便的：

```typescript
const deduplicationWithSet = (arr: number[]) => [...new Set(arr)];
```

因為 `Set` 的特性是用來儲存為一值，在這個需求下剛好非常適合。

也附上今天的 unit test：

```typescript
import { describe, expect, test } from 'vitest';
import * as utils from './deduplication';

const arr = [9, 1, 2, 2, 3, 4, 2, 4, 8, 1, 9];
const assert = (result: number[]) => expect(result).toEqual([9, 1, 2, 3, 4, 8]);

describe('deduplication suite', () => {
  test('should remove duplicates from an array - array methods', () => {
    assert(utils.deduplicationWithReduce(arr));
  });

  test('should remove duplicates from an array - object map', () => {
    assert(utils.deduplicationWithObject(arr));
  });

  test('should remove duplicates from an array - set', () => {
    assert(utils.deduplicationWithSet(arr));
  });
});
```
