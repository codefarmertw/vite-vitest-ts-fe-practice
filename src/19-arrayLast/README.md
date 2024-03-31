# 19. `Easy` 實作 Array.prototype.last

## 🔸 題目描述

請實作一個陣列方法，讓任何陣列都可以呼叫 `array.last()` 方法，這個方法會回傳陣列最後一個元素。

如果陣列中沒有元素，則傳回 `-1` 。可以假設陣列是 `JSON.parse` 的輸出結果，以及是一個 JSON 陣列。

```javascript
// 範例1 ：
輸入： nums = [null, {}, 3]
輸出： 3
解釋：呼叫 nums.last() 後傳回最後一個元素： 3。

// 範例2 ：
輸入： nums = []
輸出： -1
解釋：因為此陣列沒有元素，所以應該傳回-1。

```

## 💭 分析與思路

### 問題釐清

- 若陣列中的最後一個元素為 object，需要執行深拷貝嗎？或是直接回傳同個元素即可？

### 提出測試案例

- 能正確輸出最後一個元素
- 在空陣列時能輸出 -1
- 若最後一個元素為 object，回傳的元素的 reference 與原本的相同

```ts
import { describe, expect, test } from 'vitest';
import './arrayLast';

const testCases = [
  {
    input: [null, {}, [], false, 'codefarmer'],
    expected: 'codefarmer',
  },
  {
    input: [],
    expected: -1,
  },
  {
    input: [
      'codefarmer',
      {
        name: 'codefarmer',
        age: 18,
      },
    ],
    expected: {
      name: 'codefarmer',
      age: 18,
    },
  },
];

describe('Array.prototype.last', () => {
  test.each(testCases)('should pass test cases - %s', ({ input, expected }) => {
    if (typeof expected === 'object') {
      expect(input.last()).toBe(input[input.length - 1]);
    } else {
      expect(input.last()).toBe(expected);
    }
  });
});
```

補充一個小不同，昨天經社群大大上提醒原來可以用 `test.each` 來簡化 test cases，更容易在測試失敗時，確認是哪一個需要處理，實測後確實方便許多。

### 實作

因為這題比較單純可以直接實作：

```
interface Array<T> {
  last(): T | number;
}

Array.prototype.last = function <T>(): T | number {
  // 處理空陣列
  if (this.length === 0) {
    return -1;
  }

  // 回傳最後一個元素
  return this[this.length - 1];
};
```
