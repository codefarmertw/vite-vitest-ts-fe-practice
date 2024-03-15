# 02. `Easy` 手寫 inRange

## 🔸 題目描述

請實作一個函式 `inRange` 。此函式接受三個參數：

- `value`：要檢查的數值
- `start`：範圍的下限 (範圍包含 `start`)，預設為 0
- `end`：範圍的上限 (範圍不包含 `end`)

在實作時，要同時考量以下條件：

- 預設行為：如果僅提供兩個參數，則第二個參數被視為 `end`，而 `start` 此時預設為 0，這樣會讓使用該函式的人，在正數範圍內能更簡易地使用
- 負數範圍：如果 `start` 大於 `end`，`inRange` 會交換參數以正確處理負數範圍，確保在正負數都能被處理
- 輸出：`inRange` 函式輸出會是一個 `Boolean`

```javascript
inRange(3, 2, 4)  // => true
inRange(4, 8)     // => true
inRange(4, 2)     // => false
inRange(2, 2)     // => false
inRange(1.2, 2)   // => true
```
## 💭 分析與思路

跟昨天的 `clamp` 有點類似，但稍微再進階一點，覺得題目敘述一開始 start、end、上下界、預設 0 這些描述會比較不好釐清邏輯，但理解條件後，其實可以換個方式想：

- range 的 2 個數字誰大誰小不重要，所以換成 a, b
- b 不存在則預設為 0
- 對 a, b 比大小，小的是 lower，大的是 upper
- 最後就是 value 要能符合 lower <= value < upper

基本上如果理清邏輯後直覺的答案呼之欲出：

```ts
const inRange = (value: number, a: number, b?: number): boolean => {
  let [lower, upper] = [a, b ?? 0];

  if (lower > upper) {
    lower = b ?? 0;
    upper = a;
  }

  return lower <= value && value < upper;
};
```

然後單元測試為了要能涵蓋到各種上下界交換與帶不帶第三個變數的問題，甚至補了浮點數與負數，寫得稍微有點囉唆：

```ts
import { describe, expect, it } from 'vitest';
import inRange from './inRange';

describe('inRange', () => {
  describe('three arguments', () => {
    it('should return true if the value is within the range', () => {
      expect(inRange(3, 2, 4)).toBe(true);
    });

    it('should return false if the value is not within the range', () => {
      expect(inRange(3, 4, 5)).toBe(false);
    });

    it('should return true if the value equals the lower bound', () => {
      expect(inRange(2, 2, 4)).toBe(true);
    });

    it('should return false if the value equals the upper bound', () => {
      expect(inRange(4, 2, 4)).toBe(false);
    });

    it('should return true if start is greater than end', () => {
      expect(inRange(3, 4, 2)).toBe(true);
    });

    it('should return false if the value is less than the lower bound', () => {
      expect(inRange(-1, 0, 4)).toBe(false);
    });

    it('should return false if the value is positive and range is negative', () => {
      expect(inRange(3, -3, 0)).toBe(false);
    });

    it('should return true if the value is negative and range is negative', () => {
      expect(inRange(-4, -10, -3)).toBe(true);
    });

    it('should return true if value is a floating-point number', () => {
      expect(inRange(3.5, 2, 4)).toBe(true);
    });

    it('should return true if start is a floating-point number', () => {
      expect(inRange(3, 2.5, 4)).toBe(true);
    });

    it('should return true if end is a floating-point number', () => {
      expect(inRange(3, 2, 4.5)).toBe(true);
    });
  });

  describe('two arguments, with the lower bound being 0', () => {
    it('should return true if the value is within the range 0 to 8', () => {
      expect(inRange(4, 8)).toBe(true);
    });

    it('should return false if the value is not within the range 0 to 2', () => {
      expect(inRange(4, 2)).toBe(false);
    });

    it('should return false if the value equals the upper bound', () => {
      expect(inRange(2, 2)).toBe(false);
    });

    it('should return false if all zero arguments', () => {
      expect(inRange(0, 0)).toBe(false);
    });

    it('should return false if the value is less than the lower bound', () => {
      expect(inRange(-1, 0)).toBe(false);
    });

    it('should return false if the lower bound is negative and the value is positive', () => {
      expect(inRange(3, -3)).toBe(false);
    });

    it('should return true if the lower bound is negative and the value is within the range', () => {
      expect(inRange(-4, -10)).toBe(true);
    });
  });
});
```

看完解答後才想到其實因為是比大小所以跟 clamp 一樣用 Math.min 與 Math.max 能更精簡，另外預設值 0 的設定也不用這麼笨寫兩次：

```ts
const inRange = (value: number, a: number, b = 0): boolean =>
  Math.min(a, b) <= value && value < Math.max(a, b);
```
