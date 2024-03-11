# Day 29. `Easy` 手寫 sleep

---

## 🔸  題目描述

JavaScript 雖然內建了 `setTimeout` 控制程式暫停與繼續的方法，但使用起來有些繁瑣。請設計一個更流暢的機制，類似其他語言如 Java 和 Python 中的 `sleep` 函式，同時保持 JavaScript 非同步的特性。

```javascript
// 可以這樣
console.log('Explain');
await sleep(3000); // 停 3 秒
console.log('This');

// 或者
console.log('Explain');
sleep(3000).then(() => {
  console.log('This'); // Only logs after 3 seconds
});
```

## 💭 分析與思路

1. 首先期待這個 `sleep` 是個 Promise 能被 `await` 做非同步等待或寫成 Promise chain，因此先讓此 function 能回傳 Promise：

```typescript
export const sleep = async (duration: number) => {
  return new Promise((resolve, reject) => {
    // do something
  });
};
```

2. 而 `sleep` 的用途是希望利用傳入的 `duration` 來等待對應的毫秒數，因此這裡需要用上 `setTimeout` ，另外這裡沒有 fail 的狀況，因此不需要 `reject`：

```typescript
export const sleep = async (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, duration);
  });
};
```

3. 最後利用 arrow function 的特性移除可省略的 return 後簡寫如下：

```typescript
export const sleep = async (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));
```

## 其他

紀錄一個有趣的發現，因為另外試著寫了 Vitest 的 unit test 來測：

```typescript
import { describe, expect, test } from 'vitest';
import { sleep } from './sleep';

describe('sleep', () => {
  test('should await with sleep function using await', async () => {
    const start = Date.now();
    await sleep(3000);
    const end = Date.now();

    // assert
    console.log(end - start);
    expect(end - start).toBeGreaterThanOrEqual(3000);
  });

  test('should await with sleep function using then', () => {
    const start = Date.now();
    sleep(3000).then(() => {
      const end = Date.now();

      // assert
      expect(end - start).toBeGreaterThanOrEqual(3000);
    });
  });
});
```

一開始在最後一步在改簡寫版時誤寫成以下這樣：

```typescript
export const sleep = async (duration: number) =>
  new Promise((resolve) => setTimeout(() => resolve, duration));
```

會造成第一個測資 fail：

```bash
FAIL  src/29-sleep/sleep.test.ts > sleep > should await with sleep function using await
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
```

後來嘗試改成這樣就 pass 了：

```typescript
export const sleep = async (duration: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), duration));
```

才發現是因為省略時少拿掉 setTimeout 中的 arrow function 😅，論寫測試的重要性。
