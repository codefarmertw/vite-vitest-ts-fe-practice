# 31. `Easy` Add Two Promises (將兩個 Promise 結果相加)

## 🔸 題目描述

給定兩個 Promise，分別為 `promise1` 和 `promise2`，這兩個 Promise 都會實現 (resolve) 一個數字。請實作一個函式，接收兩個 Promises 後，回傳一個新的 Promise，回傳的新 Promise 會是這兩個 Promise 實現值的和。

```javascript
// 範例一：
輸入:
promise1 = new Promise(resolve => setTimeout(() => resolve(2), 20)),
promise2 = new Promise(resolve => setTimeout(() => resolve(5), 60))

輸出: 7

解釋:
這兩個輸入 Promise 分別實現為 2 和 5。返回的 Promise 應該實現為 2 + 5 = 7。
本題不判斷返回 Promise 實現的時間。

// 範例二：
輸入:
promise1 = new Promise(resolve => setTimeout(() => resolve(10), 50)),
promise2 = new Promise(resolve => setTimeout(() => resolve(-12), 30))

輸出: -2

解釋:
這兩個輸入 Promise 分別實現成 10 和 -12。
返回的 Promise 應該實現成 10 + -12 = -2。
```

## 💭 分析與思路

1. 先依照題意定型，輸入為兩個會 resolve number 的 promise，輸出為一個能 resolve 相加結果的 Promise：

```ts
type AddTwoPromisesType = (
  promise1: Promise<number>,
  promise2: Promise<number>
) => Promise<number>;

const addTwoPromises: AddTwoPromisesType = (promise1, promise2) => {
  return new Promise((resolve, reject) => {
    // write your code here
  });
};
```

2. 想到需要等待兩個 promise 都一起完成並處理結果，直覺就是可以使用 `Promise.all` 這個方法，可以傳入 Promise array 並得到一個 Promise：

```ts
const addTwoPromises: AddTwoPromisesType = (promise1, promise2) => {
  return new Promise((resolve, reject) => {
    Promise.all([promise1, promise2])
      .then((result) => {
        // handle result here
      })
      .catch((error) => reject(error));
  });
};
```

3. 而 `Promise.all` 被 resolve 時，得到的輸出會是這個 Promise array 中分別被 resolve 的結果並以 array 組合起來，看個 MDN 上的例子：

```javascript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
// Expected output: Array [3, 42, "foo"]
```

4. 因此這邊能直接解構取值相加就完工了：

```ts
const addTwoPromises: AddTwoPromisesType = (promise1, promise2) => {
  return new Promise((resolve, reject) => {
    Promise.all([promise1, promise2])
      .then(([num1, num2]) => resolve(num1 + num2))
      .catch((error) => reject(error));
  });
};
```

## 🦦 單元測試與其他優化

後來在寫單元測試時，有點好奇 `Promise.all` 與 `Promise.allSettled` 的差別，想說覺得可以擴展題目變成可以做多個 Promise 有被 resolve 值的相加。

先講一下差別：

- [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)： 若全部 promise 都被 fulfilled 則會回傳結果陣列。但若有其中一個 promise 被 rejected 則會會傳該 promise 的錯誤原因
- [Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)： 會將全部 promise 都執行完成後分門別類產出結果陣列，例如以下範例

```javascript
Promise.allSettled([
  Promise.resolve(33),
  new Promise((resolve) => setTimeout(() => resolve(66), 0)),
  99,
  Promise.reject(new Error('an error')),
]).then((values) => console.log(values));

// [
//   { status: 'fulfilled', value: 33 },
//   { status: 'fulfilled', value: 66 },
//   { status: 'fulfilled', value: 99 },
//   { status: 'rejected', reason: Error: an error }
// ]
```

因此改寫後的 `addPromises` 結果如下，然後這邊我只把有 resolve 的值相加比較單純：

```ts
const addPromises: AddPromisesType = (promises) => {
  return new Promise((resolve) => {
    Promise.allSettled(promises).then((results) => {
      // return the sum of the resolved values
      resolve(
        results
          .filter(
            (result): result is PromiseFulfilledResult<number> =>
              result.status === 'fulfilled'
          )
          .reduce<number>((acc, result) => acc + result.value, 0)
      );
    });
  });
};
```

對應的基本單元測試：

```ts
import { describe, expect, it } from 'vitest';
import { addPromises } from './addPromises';
import sleep, { PROMISE_STATE } from '../utils/sleep';

describe('addPromises', function () {
  it('should resolve with the sum of the resolved values of the two promises', async function () {
    const promise1 = sleep({
      duration: 10,
      value: 1,
      state: PROMISE_STATE.FULFILLED,
    });
    const promise2 = sleep({
      duration: 20,
      value: 2,
      state: PROMISE_STATE.FULFILLED,
    });
    const result = await addPromises([promise1, promise2]);
    expect(result).toBe(3);
  });

  it('should reject if either of the promises rejects', async function () {
    const promise1 = sleep({
      duration: 10,
      value: 1,
      state: PROMISE_STATE.FULFILLED,
    });
    const promise2 = sleep({
      duration: 20,
      value: 2,
      state: PROMISE_STATE.REJECTED,
    });

    const result = await addPromises([promise1, promise2]);
    expect(result).toBe(1);
  });

  it('should resolve the sum with resolved promises', async function () {
    const promise1 = sleep({
      duration: 10,
      value: 1,
      state: PROMISE_STATE.FULFILLED,
    });
    const promise2 = sleep({
      duration: 20,
      value: 2,
      state: PROMISE_STATE.REJECTED,
    });
    const promise3 = sleep({
      duration: 30,
      value: 3,
      state: PROMISE_STATE.REJECTED,
    });
    const promise4 = sleep({
      duration: 40,
      value: 5565,
      state: PROMISE_STATE.FULFILLED,
    });

    const result = await addPromises([promise1, promise2, promise3, promise4]);
    expect(result).toBe(5566);
  });
});
```

另外也把一直被用到的 sleep 抽成共用 utils 了，查了一下感覺 sleep 的功能還可以再擴充成 cancelable 的，但研究到一半先這樣。
