# 15. `Easy` 實作 `Array.prototype.square`

## 🔸 題目描述

想像一下，你正在參與一個高度仰賴陣列操作的項目。你的任務是為陣列原型設計一個新的方法，叫做 `square()`。這個方法應該有效率地迭代陣列中的每個元素，並返回一個全新的陣列，其中每個元素都是原始元素的平方。假設陣列中只包含數字。

```javascript
const numbers = [1, 2, 3, 4, 5];
const mixedArray = [1, 3.5];
const emptyArray = [];

numbers.square(); // [1, 4, 9, 16, 25]
mixedArray.square(); // [1, 12.25]
emptyArray.square(); // []
```

## 💭 分析與思路

### 提出測試案例

題目蠻單純的，已限縮是 number array，簡單列幾個 test case：

- 整數、浮點數、負數、空陣列
- 極大值、極小值
- NaN 應回傳 NaN

```ts
import { expect, it } from 'vitest';
import './square';

const testCases = [
  [
    [0, -1, 2, -3, 4, -5],
    [0, 1, 4, 9, 16, 25],
  ],
  [
    [1.25, 2.5, 3.75, 5.9],
    [1.5625, 6.25, 14.0625, 34.81],
  ],
  [
    [NaN, NaN],
    [NaN, NaN],
  ],
  [
    [Infinity, -Infinity],
    [Infinity, Infinity],
  ],
  [
    ['code', 'farmer', 'codefarmer'],
    [NaN, NaN, NaN],
  ],
  [
    [
      { name: 'code', age: 18 },
      { name: 'farmer', age: 18 },
    ],
    [NaN, NaN],
  ],
];

it('Array.prototype.square', () => {
  testCases.forEach(([input, expected]) => {
    expect(input.square()).toEqual(expected);
  });
});
```

參考前幾天在 threads 上看到 a.chin 大的建議，學習了更簡潔的寫法，好像單元測試小小進步了一些，然後也順便擴充成各種型別都支援，反正大不了輸出是 NaN 而已。

### 提出思路

- 比較關鍵的應該就是能在使用 square 方法的該陣列能用 this 取到該陣列的值
- 取到值後，題目要求回傳新陣列，再用 map 處理就完成

### 實作

結果反而是卡在型別定義上，查了一下資料才寫出來，這裡因為不做 `T extends number` 的話乘法運算會噴錯，所以加了一下：

```ts
interface Array<T extends number> {
  square(): T[];
}

Array.prototype.square = function <T extends number>(): T[] {
  return this.map<T>((item: T) => (item * item) as T);
};
```

雖然是秒殺題，但今天還是有學到一些小東西，真不錯。
