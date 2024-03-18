# 32. `Easy` Cancelable timeout (可取消的延遲函式)

## 更新

在寫 33 題時，發現測試的部分可以用 fake timers 寫，詳細可見 [src/33-cancelableInterval](../src/33-cancelableInterval)

## 🔸 題目描述

給定一個函式 `fn` ，一個參數陣列 `args` 和一個以毫秒為單位的超時時間 `t`，回傳一個取消函式 `cancelFn`。在`cancelTimeMs` 的延遲後取消函式 `cancelFn` 將被呼叫。

```javascript
setTimeout(cancelFn，cancelTimeMs);
```

最開始，函式 `fn` 的執行應該延遲 `t` 毫秒。如果在 `t` 毫秒的延遲之前呼叫了函式 `cancelFn`，它應該取消 `fn` 的延遲執行。如果在指定的延遲 `t` 內沒有呼叫 `cancelFn`，則應執行 `fn`，並使用提供的 `args` 作為參數。

```javascript
// 範例

// 輸入： fn = (x) => x * 5, args = [2], t = 20
// 輸出： [{"time": 20, "returned": 10}]

// 解釋：
const cancelTimeMs = 50;
const cancelFn = cancelableTimeout((x) => x * 5, [2], 20);
setTimeout(cancelFn, cancelTimeMs);
// fn(2) 在 20 毫秒時執行，而取消操作將在這之後，延遲 cancelTimeMs（50毫秒）後被呼叫
```

## 💭 分析與思路

這題初看題意有點難理解，總覺得輸出應該不只是 `cancelFn` 而已，但就直接從範例來一步步分析題目所需要實作的 `cancelableTimeout` 需要的邏輯是什麼：

- 輸入需能有 3 個參數：
  - timeout：要延遲執行 `fn` 的時間，以毫秒為單位
  - fn：預計要被延遲 `timeout` 毫秒後執行的函式
  - args：對應到 `fn` 的參數陣列
- 輸出需要的是一個能主動去觸發取消被延遲的 fn 的函式

理解後感覺其實這題算是第 29 題 sleep 的延伸版，就是想實做一個可被取消的 timeout function。

參考題目的範例先來寫一個基本的單元測試案例：

```ts
describe('cancelableTimeout', function () {
  it('should get result if the timeout less than the cancel duration', async function () {
    const fn = (x: number) => x * 5;
    const args = [2];
    const timeout = 20;

    const cancelTimeMs = 50;
    const cancelFn = cancelableTimeout(fn, args, timeout);

    setTimeout(cancelFn, cancelTimeMs);
  });
});
```

寫到這突然覺得不太確定要怎麼決定 assert 的內容，因此就先試著去完成主程式，首先先對輸入與輸出做 TypeScript 定型：

```ts
type CancelFn = () => void;

const cancelableTimeout = <T extends unknown[], R>(
  fn: (...args: T) => R,
  args: [...T],
  timeout: number
): CancelFn => {
  // write your code here

  const cancelFn = () => {};

  return cancelFn;
};

export default cancelableTimeout;
```

這裡的型別稍微複雜一些，使用了 2 個泛型：

- `T` 代表 `args` 的所有參數，而 `args` 會對應到 `fn` 的輸入
- 而 `R` 則代表 `fn` 函式的 return value
- `CancelFn` 的型別避免看起來太亂，另外宣告出去

先完成主要邏輯，能讓此函式去在 `timeout` 毫秒後去執行 `fn(…args)` ，寫個 `setTimeout` 處理一下：

```ts
const cancelableTimeout = <T extends unknown[], R>(
  fn: (...args: T) => R,
  args: [...T],
  timeout: number
): CancelFn => {
  setTimeout(() => {
    fn(...args);
  }, timeout);

  const cancelFn = () => {};

  return cancelFn;
};
```

接下來來完成 `cancelFn` ，為了要能主動去取消 `fn` 的延遲執行，需要紀錄 `timeoutId` 及一個 flag 確認是否已被取消：

```ts
const cancelableTimeout = <T extends unknown[], R>(
  fn: (...args: T) => R,
  args: [...T],
  timeout: number
): CancelFn => {
  let timeoutId: number | null = null;
  let isCancelled = false;

  timeoutId = setTimeout(() => {
    // 在 timeout 毫秒後如果還沒被取消則執行 fn
    if (!isCancelled) {
      fn(...args);
    }
  }, timeout);

  const cancelFn = () => {
    // 如果 timeoutId 存在則清掉
    if (timeoutId) {
      clearTimeout(timeoutId);
      isCancelled = true;
    }
  };

  return cancelFn;
};
```

到這裡推測題目應該是要能把 `fn` 執行的內容用 Promise 輸出，並稍微整理一下型別改寫如下：

```ts
type CancelableTimeoutResult<R> = {
  cancel: () => void;
  fnResult: Promise<R>;
};

const cancelableTimeout = <T extends unknown[], R>(
  fn: (...args: T) => R,
  args: [...T],
  timeout: number
): CancelableTimeoutResult<R> => {
  let timeoutId: number | null = null;
  let isCancelled = false;

  const fnResult = new Promise<R>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      if (isCancelled) {
        reject(new Error('fn has been canceled!'));
      } else {
        resolve(fn(...args));
      }
    }, timeout);
  });

  const cancelFn = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      isCancelled = true;
    }
  };

  return {
    cancel: cancelFn,
    fnResult,
  };
};
```

後來發現其實這個 `CancelableTimeoutResult` 其實也可以不用寫，會自動被 TypeScript 推論出來，但為了讀起來更方便就先留著。

另外也把剛才做到一半的單元測試補足一些測試案例：

```ts
import { describe, expect, it } from 'vitest';
import cancelableTimeout from './cancelableTimeout';

describe('cancelableTimeout', function () {
  it('should get result if the timeout less than the cancel duration', async function () {
    const fn = (x: number) => x * 5;
    const args = [2];
    const timeout = 20;

    const cancelTimeMs = 50;
    const { cancel, fnResult } = cancelableTimeout<number[], number>(fn, args, timeout);

    try {
      const res = await fnResult;
      expect(res).toBe(10);
    } catch (error) {
      expect(error).toBeUndefined();
    }

    setTimeout(cancel, cancelTimeMs);
  });

  it('should reject if the timeout is larger than the cancel duration', async function () {
    const fn = (x: number) => x * 5;
    const args = [2];
    const timeout = 50;

    const cancelTimeMs = 20;
    const { cancel, fnResult } = cancelableTimeout<number[], number>(fn, args, timeout);

    try {
      await fnResult;
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('fn has been canceled!');
      }
    }

    setTimeout(cancel, cancelTimeMs);
  });

  it('should resolve with multiple arguments', async function () {
    const fn = (x: string, y: number, z: number) => x + y * z;
    const args: [string, number, number] = ['100', 3, 5];
    const timeout = 20;

    const cancelTimeMs = 50;
    const { cancel, fnResult } = cancelableTimeout<[string, number, number], string>(
      fn,
      args,
      timeout
    );

    try {
      const res = await fnResult;
      expect(res).toBe('10015');
    } catch (error) {
      expect(error).toBeUndefined();
    }

    setTimeout(cancel, cancelTimeMs);
  });
});
```

可以同時確保在 `cancelableTimeout` 被 cancel 時，被傳入的 `fn` 能如預期地不被執行。
