# 36. `Medium` Promise with Time Limit

## 🔸 題目描述

給定一個非同步函式 `fn` 和一個時間限制 `t`（以毫秒為單位），回傳一個具有時間限制（time limited）版本的函式。 `fn` 會接受具有時間限制（time limited）函式的參數。

這個具有時間限制（time limited）的函式要符合以下條件：

- 如果 `fn` 在 `t` 毫秒的時間限制內完成，則具有時間限制（time limited）的函式應該解析（resolve）為 `fn` 的結果。
- 如果 `fn` 的執行時間超過了時間限制，則具有時間限制（time limited）的函數應該拒絕（reject），並返回字串 `"Time Limit Exceeded"`

```javascript
// 範例
輸入:
fn = async (n) => {
  await new Promise(res => setTimeout(res, 100));
  return n * n;
}
inputs = [5]
t = 50

輸出: {"rejected":"Time Limit Exceeded","time":50}

解說:
const limited = timeLimit(fn, t)
const start = performance.now()
let result;
try {
   const res = await limited(...inputs)
   result = {"resolved": res, "time": Math.floor(performance.now() - start)};
} catch (err) {
   result = {"rejected": err, "time": Math.floor(performance.now() - start)};
}

原本傳入的 Promise 在 100 毫秒後會解析，
但時間限制是 50 毫秒，
所以在 t=50 毫秒時，Promise 被拒絕
```

## 💭 分析與思路

### 問題釐清

- 期待的輸出會是一個可執行的 Promise，並能在被 resolved、rejected 後回傳結果與 time？
- 輸出的 time 是否不需要精準，因為 `performance.now()` 不會是精準的時間，又或者 time 只是範例的示意？

### 提出測試案例

- 能各通過 resolve、reject 的基本測資
- 輸出的 time 若能被 resolve 則需小於等於 t，若會被 reject 則需大於等於 t
- 測試當 fn 與 t 為相同的狀態

### 提出思路

- 對題目的輸入輸出做 TypeScript 定型
  - fn 為 Promise，能吃複數個參數 n
  - t 為 number
  - 輸出為一個能吃複數個參數 n 的 Promise，並能輸出一個物件，其中包含解析或拒絕對應結果，與實際執行時間
- 輸出一個可傳入參數 n 的 function 並能在執行後回傳 promise，裡面能用 setTimeout 去判斷是否該中斷計時器並輸出結果

```ts
type InputPromiseFn<T extends unknown[], R> = (...args: T) => Promise<R>;

interface ResolvedResultType<R> {
  resolved: R;
  time: number;
}

interface RejectedResultType {
  rejected: string;
  time: number;
}

type ResultType<R> = ResolvedResultType<R> | RejectedResultType;

type OutputPromiseFn<T extends unknown[], R> = (...args: T) => Promise<ResultType<R>>;

const promiseWithTimeLimit = <T extends unknown[], R>(
  fn: InputPromiseFn<T, R>,
  t: number
): OutputPromiseFn<T, R> => {
  return (...args) =>
    new Promise((resolve, reject) => {
      // write your code here
    });
};
```

### 實作

```ts
const promiseWithTimeLimit = <T extends unknown[], R>(
  fn: InputPromiseFn<T, R>,
  t: number
): OutputPromiseFn<T, R> => {
  // 計算開始時間
  const startTime = performance.now();

  // 能輸出一個可傳入 ...args 的 Promise 函式
  return (...args) =>
    new Promise((resolve, reject) => {
      // 當超過 t 時間，則 reject
      const timeoutId = setTimeout(() => {
        reject({
          rejected: 'Time Limit Exceeded',
          time: Math.ceil(performance.now() - startTime),
        });
      }, t);

      // 執行 fn 並與 timeout function 競爭看誰先完成
      fn(...args).then((res) => {
        // 如果更早完成，需清掉 timeoutId 並 resolve 結果
        clearTimeout(timeoutId);
        resolve({
          resolved: res,
          time: Math.ceil(performance.now() - startTime),
        });
      });
    });
};
```

這題的內容複雜一點，所以其實單元測試是實作完成後才補上：

```ts
import { describe, expect, it } from 'vitest';
import promiseWithTimeLimit, {
  type RejectedResultType,
  type ResolvedResultType,
} from './promiseWithTimeLimit';

describe('promise with time limit', () => {
  it('should be rejected when time limit exceeded', async () => {
    const fn = async (n: number) => {
      await new Promise((res) => setTimeout(res, 100));
      return n * n;
    };
    const inputs: [number] = [5];
    const t = 50;

    const limitedFn = promiseWithTimeLimit(fn, t);

    try {
      await limitedFn(...inputs);
    } catch (error) {
      const { rejected, time } = error as RejectedResultType;

      expect(rejected).toEqual('Time Limit Exceeded');
      expect(time).toBeGreaterThanOrEqual(t);
    }
  });

  it('should be resolved when time limit not exceeded', async () => {
    const fn = async (n: number) => {
      await new Promise((res) => setTimeout(res, 100));
      return n * n;
    };
    const inputs: [number] = [5];
    const t = 150;

    const limitedFn = promiseWithTimeLimit(fn, t);

    try {
      const { resolved, time } = (await limitedFn(
        ...inputs
      )) as ResolvedResultType<number>;

      expect(resolved).toEqual(25);
      expect(time).toBeLessThanOrEqual(t);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should check promiseWithTimeLimit works with multiple arguments and same time limit', async () => {
    const fn = async (x: string, y: number) => {
      await new Promise((res) => setTimeout(res, 100));
      return x + y;
    };
    const inputs: [string, number] = ['10', 10];
    const t = 100;

    const limitedFn = promiseWithTimeLimit(fn, t);

    try {
      const { resolved, time } = (await limitedFn(
        ...inputs
      )) as ResolvedResultType<string>;

      expect(resolved).toEqual('1010');
      expect(time).toBeLessThanOrEqual(t);
    } catch (error) {
      const { rejected, time } = error as RejectedResultType;

      expect(rejected).toEqual('Time Limit Exceeded');
      expect(time).toBeGreaterThanOrEqual(t);
    }
  });
});
```

不過後來看了解答後才發現原來可以用 `Promise.race` 來做更簡潔，然後確實一開始看錯題目範例中輸出的 time 其實只是示意，並沒有包含在 `timeLimit` 的輸出中，所以其實這題可以更短：

```ts
const promiseWithTimeLimit2 = <T extends unknown[], R>(
  fn: InputPromiseFn<T, R>,
  t: number
) => {
  return (...args: T) => {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject('Time Limit Exceeded'), t)
    );

    return Promise.race([fn(...args), timeoutPromise]);
  };
};
```
