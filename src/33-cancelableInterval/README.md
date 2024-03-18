# 33. `Easy` Cancelable interval (可取消的間隔函式)

## 🔸 題目描述

給定一個函式 `fn` ，一個參數陣列 `args` 和一個時間間隔 `t` ，回傳一個取消函式 `cancelFn`。在經過 `cancelTimeMs` 毫秒的延遲後，將呼叫回傳的取消函式 `cancelFn`。

```javascript
setTimeout(cancelFn, cancelTimeMs)
```

函式 `fn` 應立即使用參數 `args` 呼叫，然後每隔 `t` 毫秒呼叫一次，直到 `cancelTimeMs` 毫秒時呼叫 `cancelFn`。

```javascript
// 範例
輸入： fn = (x) => x * 2, args = [4], t = 35, cancelT = 190
輸出：
[
   {"時間": 0, "返回": 8},
   {"時間": 35, "返回": 8},
   {"時間": 70, "返回": 8},
   {"時間": 105, "返回": 8},
   {"時間": 140, "返回": 8},
   {"時間": 175, "返回": 8},
]

解釋：
const cancelTimeMs = 190;
const cancelFn = cancellable((x) => x * 2, [4], 35);
setTimeout(cancelFn, cancelTimeMs);

每隔 35ms，呼叫 fn(4)。直到 t = 190 ms，然後取消。
第一次呼叫 fn 是在 0ms，fn(4) 返回8。
第二次呼叫 fn 是在 35ms，fn(4) 返回8。
第三次呼叫 fn 是在 70ms，fn(4) 返回8。
第四次呼叫 fn 是在 105ms，fn(4) 返回8。
第五次呼叫 fn 是在 140ms，fn(4) 返回8。
第六次呼叫 fn 是在 175ms，fn(4) 返回8。
在 t = 190 ms 時取消
```

## 💭 分析與思路

這題其實與 [32 題的 timeout cancellation](../src/32-cancelableTimeout) 蠻類似的，只差在將 `setTimeout` 相關的部分換成 `setInterval` ，因此蠻單純的直接調整如下，另外也整理一下不需要的型別：

```ts
const cancelableInterval = <T extends unknown[], R>(
  fn: (...args: T) => R,
  args: [...T],
  t: number
) => {
  let currentTime = 0;

  // 因為題目需求要能立即使用參數 args 呼叫，這裡初始值 call 一次 fn
  const output = [
    {
      time: currentTime,
      returned: fn(...args),
    },
  ];

  const intervalId = setInterval(() => {
    currentTime += t;
    output.push({
      time: currentTime,
      returned: fn(...args),
    });
  }, t);

  // 為了單元測試方便做斷言，這裡也將 output 存下來做為輸出
  return {
    cancel: () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    },
    output,
  };
};
```

話說一開始眼殘沒看到題目要求要能立即執行一次，所以也問了一下 Li，後來經提醒才知道是看錯題目，而原來這題的原題是參考自 [LeetCode 的 2725](https://leetcode.com/problems/interval-cancellation/description/)。

## 單元測試

今天想做 assert 時又遇到跟昨天一樣的困難，但其實昨天要另外自己再執行一次 promise 總覺得怪怪的，於是今天與 Gemini Advanced 討論了一下後，才知道 Vitest 中可以去做一些 fake timers 的操作 ([ref](https://vitest.dev/guide/mocking.html#timers))：

```ts
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import cancelableInterval from './cancelableInterval';

describe('cancelableTimeout', function () {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should get correct interval output and called times after fn is cancelled', () => {
    // spy on the fn function
    const fn = vi.fn((x: number) => x * 2);
    const args = [4];
    const t = 35;

    const cancelTimeMs = 190;
    const { cancel, output } = cancelableInterval<number[], number>(fn, args, t);
    setTimeout(cancel, cancelTimeMs);

    // wait for the cancel to be called with fake timers
    vi.advanceTimersByTime(cancelTimeMs * 2);

    // assert the output
    expect(output).toEqual([
      { time: 0, returned: 8 },
      { time: 35, returned: 8 },
      { time: 70, returned: 8 },
      { time: 105, returned: 8 },
      { time: 140, returned: 8 },
      { time: 175, returned: 8 },
    ]);

    // assert the fn should be called 6 times
    expect(fn).toHaveBeenCalledTimes(6);
  });
});
```

簡單做一些筆記：

- 當需要啟用 mocking timer 時，需在每個測試執行前（beforeEach）去執行 `vi.useFakeTimers`
- 在每個測試案例結束後（afterEach），執行 `vi.restoreAllMocks` 來清掉所有監測函式與被 mock 的內容
- 在 `fn` 的地方為了方便斷言確認被呼叫的次數，一開始需要用 `vi.fn` 來監測目標函式 ([ref](https://vitest.dev/api/vi.html#vi-fn))
- 使用 `vi.advanceTimersByTime` 來模擬等待了 `cancelTimeMs` 的時間再來進行後續動作，這裡用了兩倍的 `cancelTimeMs` 確保 cancel 有被觸發，並且 `cancelableInterval` 有確實被取消

## 關於 `AbortController` 與 `signal`

昨天的 `cancelableTimeout` 中在 [Threads](https://www.threads.net/@a.chin.logs/post/C4oYY-2SYz4) 上經 `a.chin.logs` 分享有個類似概念的 Web API —— `AbortController` 與 `signal`，研究了一下確實概念上蠻類似的，但這個看起來主要是被拿來做 fetch API 的取消，也稍微筆記一下範例：

```javascript
const controller = new AbortController();
const signal = controller.signal;

// 使用 signal 建立一個新的 fetch 請求
const fetchPromise = fetch('https://example.com/', {
  signal,
});

// 監聽 'abort' 事件
controller.signal.addEventListener('abort', () => {
  console.log('請求已中止');
});

// 觸發 'abort' 事件
controller.abort();
```
