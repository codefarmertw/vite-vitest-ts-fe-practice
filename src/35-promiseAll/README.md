# 35. `Medium` Execute Asynchronous Functions in Parallel (Promise.all related)

## 🔸 題目描述

> 原題目參考自 [ExplainThis](https://www.explainthis.io/zh-hant/swe/exec-async-functions-in-parallel) 及 [LeetCode 30 Days of JavaScript - 2721. Execute Asynchronous Functions in Parallel](https://leetcode.com/problems/execute-asynchronous-functions-in-parallel/description/?envType=study-plan-v2&envId=30-days-of-javascript)

實作一個 `promiseAll` 函式，給定一個非同步函式陣列 `functions`，陣列中的每個函式都不接受任何參數，並且每個陣列都會回傳一個 Promise，且所有 Promise 都應並行執行。該函式最終會回傳一個 `promise`

該 `promise` 的解析 (resolve) 條件：

- 當 `functions` 中返回的所有 Promise 都成功並行被 resolve 時，這個 `promiseAll` 函式的 resolved value 會是一個陣列，其中包含與 `functions` 中的順序相同的 resolved value。當陣列中的所有非同步函式并行執行完成後，`promiseAll` 回傳的這個 `promise` 才會被 resolve。

`promise` 的拒絕 (reject) 情況：

- 當 `functions` 中返回的任何 Promise 被 reject 時。`promise` 也應以第一個拒絕的原因拒絕。

此題不得使用 JavaScript 內建的 `Promise.all` 函式來解。

```javascript
// Example 1:
輸入: functions = [
  () => new Promise(resolve => setTimeout(() => resolve(5), 200))
]
輸出: {"t": 200, "resolved": [5]}
解釋: 唯一一個函式在 200 毫秒後解析，值為 5。


// Example 2:
輸入: functions = [
    () => new Promise(resolve => setTimeout(() => resolve(1), 200)),
    () => new Promise((resolve, reject) => setTimeout(() => reject("Error"), 100))
]
輸出：{"t": 100, "rejected": "Error"}
解釋：由於其中一個 Promise 被拒絕，返回的 Promise 也會在同一時間以相同的錯誤原因被拒絕。


// Example 3:
輸入: functions = [
    () => new Promise(resolve => setTimeout(() => resolve(4), 50)),
    () => new Promise(resolve => setTimeout(() => resolve(10), 150)),
    () => new Promise(resolve => setTimeout(() => resolve(16), 100))
]
輸出: {"t": 150, "resolved": [4, 10, 16]}
解釋: 所有 promise function 都被 resolved 時，回傳值 array 需按照原 functions 順序排列。
```

## 🧪 事前準備

先來做一些事前準備，首先對 `promiseAll` 做 TypeScript 定型，並準備好函式中的回傳型別外殼做出來：

```ts
type PromiseResult<T> = {
  t: number;
  resolved?: T[];
  rejected?: string;
};

type PromiseFn<T> = () => Promise<T>;

const promiseAll = <T>(promiseFunctions: PromiseFn<T>[]): Promise<PromiseResult<T>> => {
  const results: T[] = [];

  return new Promise((resolve, reject) => {
    // write your code here
  });
};
```

比較特別的是原題目是希望傳入 promise functions array，其實跟實際的 `Promise.all` 不太一樣，原版的 `Promise.all` 是傳入 promise array，所以這裡另外拉出 `PromiseFn` 這個 type，並決定一個泛型 `T` 讓這些 function 能更有彈性定義 resolved value 型別。

另外我覺得比較關鍵的是範例三，從這個範例可以知道當所有 promise funciton 被 resolve 後，題目實際要的結果值會是一個 object，只有當下時間 `t` 與一個「按照原本 functions 順序的」resolved value array。

另外先準備好基本的單元測試案例：

```ts
import { describe, expect, it } from 'vitest';
import promiseAll from './promiseAll';

describe('promiseAll', () => {
  it('should get the result of single promise', async () => {
    const promise1 = () => new Promise((resolve) => setTimeout(() => resolve(5), 200));
    const functions = [promise1];

    const result = await promiseAll(functions);

    expect(result).toEqual({ t: 200, resolved: [5] });
  });

  it('should get rejected result if any promise is rejected', async () => {
    const promise1 = () => new Promise((resolve) => setTimeout(() => resolve(1), 200));
    const promise2 = () =>
      new Promise((_, reject) => setTimeout(() => reject('Error'), 100));
    const functions = [promise1, promise2];

    const result = await promiseAll(functions);

    expect(result).toEqual({ t: 100, rejected: 'Error' });
  });

  it('should get the correct order and time when multiple promises all resolved', async () => {
    const promise1 = () => new Promise((resolve) => setTimeout(() => resolve(4), 50));
    const promise2 = () => new Promise((resolve) => setTimeout(() => resolve(10), 150));
    const promise3 = () => new Promise((resolve) => setTimeout(() => resolve(16), 100));
    const functions = [promise1, promise2, promise3];

    const result = await promiseAll(functions);

    expect(result).toEqual({ t: 150, resolved: [4, 10, 16] });
  });
});
```

## 💭 分析與思路

首先先準備回傳值需要的 `t` 與 `resolved` array，並對 `functions` 迭代去執行：

```ts
const promiseAll = <T>(functions: PromiseFn<T>[]): Promise<PromiseResult<T>> => {
  let t = 0;
  const resolved: T[] = [];

  return new Promise((resolve, reject) => {
    functions.forEach(async (fn, index) => {
      try {
        const value = await fn();
        results[index] = value;

        // TODO: update current time: t
      } catch (error) {
        // TODO: update current time: t

        // 當有其中一個被 reject 時，則整個 promiseAll 函式 reject 結果
        reject({
          t,
          rejected: 'Error',
        });
      }
    });
  });
};
```

這邊比較要注意的是題目要求的是「按照原本 functions 順序的」resolved value array，所以不能隨便 push，需要依照 index 順序放入 resolved 陣列中。

寫到這邊有點卡住，要怎麼更新 t 以及要怎麼確認 resolve 條件？

先粗暴一些用 counter 的方式：

```ts
const promiseAll = <T>(functions: PromiseFn<T>[]): Promise<PromiseResult<T>> => {
  let t = 0;
  const resolved: T[] = [];
  let counter = 0;

  return new Promise((resolve, reject) => {
    functions.forEach(async (fn, index) => {
      try {
        const value = await fn();
        resolved[index] = value;

        // 當計數到與 functions 陣列同長度，代表大家都執行完了可以 resolve 結果
        counter++;
        if (counter >= functions.length) {
          // TODO: update current time: t
          resolve({
            t,
            resolved,
          });
        }
      } catch (error) {
        // TODO: update current time: t
        reject({
          t,
          rejected: 'Error',
        });
      }
    });
  });
};
```

最後就是處理 `t` 的部分了，試著用 `Date.now()` 或 `performance.now()` 其實都不會是準確的時間，畢竟跑 forEach 等執行程式會有時間誤差，後來去看了解答才發現原來題目的 `t` 只是示意而已，誤解了題目要的輸出。

因此再把最後結果整理一下並補上 edge case：

```ts
type PromiseFn<T> = () => Promise<T>;

const promiseAll = <T>(functions: PromiseFn<T>[]) => {
  // 當傳入陣列為空，直接回傳空陣列
  if (functions.length === 0) {
    return [];
  }

  let counter = 0;
  const results: T[] = [];

  return new Promise((resolve, reject) => {
    functions.forEach(async (fn, index) => {
      try {
        const value = await fn();

        // 需要按照 index 順序放入 resolved value
        results[index] = value;

        // 判斷是否所有的 promise functions 都已經執行完成
        counter++;
        if (counter >= functions.length) {
          resolve(results);
        }
      } catch (error) {
        // 有任何 promise 被 reject 時，直接中斷
        reject(error);
      }
    });
  });
};

export default promiseAll;
```

以及調整一下單元測試來確認是否時間確實有被中斷：

```ts
import { describe, expect, it } from 'vitest';
import promiseAll from './promiseAll';

describe('promiseAll', () => {
  it('should get the result of single promise', async () => {
    const promise1 = () => new Promise((resolve) => setTimeout(() => resolve(5), 200));
    const functions = [promise1];

    const start = performance.now();
    const results = await promiseAll(functions);
    const end = performance.now();

    expect(results).toEqual([5]);
    expect(end - start).toBeGreaterThanOrEqual(200);
  });

  it('should get rejected result if any promise is rejected', async () => {
    const promise1 = () => new Promise((resolve) => setTimeout(() => resolve(1), 200));
    const promise2 = () =>
      new Promise((_, reject) => setTimeout(() => reject('Error'), 100));
    const functions = [promise1, promise2];

    const start = performance.now();
    try {
      await promiseAll(functions);
    } catch (error) {
      if (typeof error === 'string') {
        expect(error).toBe('Error');
      }
    } finally {
      const duration = performance.now() - start;
      expect(duration).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThan(200);
    }
  });

  it('should get the correct order and time when multiple promises all resolved', async () => {
    const promise1 = () => new Promise((resolve) => setTimeout(() => resolve(4), 50));
    const promise2 = () => new Promise((resolve) => setTimeout(() => resolve(10), 150));
    const promise3 = () => new Promise((resolve) => setTimeout(() => resolve(16), 100));
    const functions = [promise1, promise2, promise3];

    const start = performance.now();
    const results = await promiseAll(functions);
    const end = performance.now();

    expect(results).toEqual([4, 10, 16]);
    expect(end - start).toBeGreaterThanOrEqual(150);
  });

  it('should get empty array if no promise is provided', async () => {
    const results = await promiseAll([]);

    expect(results).toEqual([]);
  });
});
```
