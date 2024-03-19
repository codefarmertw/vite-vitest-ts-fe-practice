# 34. `Medium` 手寫 Repeat

## 🔸 題目描述

手寫一個 `repeat` 函式，會接受三個參數，包含：

- `func`：要重複執行的函式
- `times`：重複執行的次數
- `wait`：每次重複之間的間隔時間

最後 repeat 會返回一個可執行函式，該函式執行時會重複執行 `func` 函式 `times` 次，每次間隔 `wait` 毫秒。

```javascript
const repeatFunc = repeat(console.log, 3, 5000);
repeatFunc('ExplainThis'); // 每 5 秒輸出一次 ExplainThis，共輸出 3 次
```

## 💭 分析與思路

1. 看到題目是需要重複執行多次，直覺是會需要使用 `setInterval`，這裡先對函式基本的樣子做定型：

```ts
const repeat = <T, R>(func: (arg: T) => R, times: number, duration: number) => {
  return (arg: T) => {
    // write your code here
  };
};
```

這裡為了讓 `func` 的內容更有彈性，將傳入的參數及回傳值宣告為泛型，讓使用者自行決定使用的函式型別，並且回傳的 `repeatFunc` 中也要能有對應的輸入參數，因此一樣定為 `arg: T`

2. 接下來因為需要計算執行次數，準備一個計數的變數，並實作 `setInterval` 邏輯：

```ts
const repeatBasic = <T, R>(func: (arg: T) => R, times: number, duration: number) => {
  let counter = 0;

  return (arg: T) => {
    const intervalId = setInterval(() => {
      if (counter >= times) {
        // 當已達到執行重複次數後中斷 interval
        clearInterval(intervalId);
      } else {
        // 否則計數與執行 func
        counter++;
        func(arg);
      }
    }, duration);
  };
};
```

3. 基本上這樣就大功告成了，寫個單元測試驗證一下：

```ts
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import repeat from './repeat';

describe('repeat function with interval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic repeat function', () => {
    it('should get correct called times after repeat', () => {
      // spy on the func
      const func = vi.fn(console.log);
      const times = 3;
      const duration = 5000;
      const str = 'codefarmer.tw';

      const repeatFunc = repeat(func, times, duration);
      repeatFunc(str);

      // wait for the cancel to be called with fake timers
      vi.advanceTimersByTime(duration * times + 100);

      expect(func).toHaveBeenCalledTimes(3);
      expect(func).toHaveBeenNthCalledWith(1, str);
      expect(func).toHaveBeenNthCalledWith(2, str);
      expect(func).toHaveBeenNthCalledWith(3, str);
    });
  });
});
```

## ✨ 延伸實作

在實作單元測試的過程中，實在也有點想驗證一下多個參數與有回傳值的 `func` 要怎麼做，因此參考前幾天的練習改了一版進階版的：

```ts
const repeatAdvanced = <T extends unknown[], R>(
  func: (...args: T) => R,
  times: number,
  duration: number
) => {
  let counter = 0;
  const output: R[] = [];

  const repeatFunc = (...args: T) => {
    const intervalId = setInterval(() => {
      if (counter >= times) {
        clearInterval(intervalId);
      } else {
        counter++;
        const res = func(...args);

        // 若執行 func 後有回傳值則放至 output 中
        if (!!res) {
          output.push(res);
        }
      }
    }, duration);
  };

  return {
    repeatFunc,
    output,
  };
};
```

其實也就是把 `func` 的型別改成可以吃多個參數，並且能另外用一個 output array 去存執行後的結果，也用單元測試驗證一下：

```ts
it('should get correct output and called times after repeat', () => {
  // spy on the func
  const func = vi.fn((x: number, y: number) => x * y);
  const times = 5;
  const duration = 1000;

  const { repeatFunc, output } = repeatAdvanced<number[], number>(func, times, duration);
  repeatFunc(2, 3);

  // wait for the cancel to be called with fake timers
  vi.advanceTimersByTime(duration * times + 100);

  expect(func).toHaveBeenCalledTimes(5);
  expect(output).toEqual([6, 6, 6, 6, 6]);
});
```
