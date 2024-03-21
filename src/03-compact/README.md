# 3. `Easy` 手寫 lodash.compact

## 🔸 題目描述

請實作一個 compact 效用函式。 compact 能將輸入的陣列中的 false、null、0、空字串、undefined 和 NaN 都去除，請實作此 `compact` 函式。

```javascript
// 範例一
compact([0, 1, false, 2, '', 3, 'hello'])
// => [1, 2, 3, 'hello']

// 範例二
compact([null, undefined, NaN, ' '])
// =>[' ']

// 範例三
compact([{ name: 'Alice' }, null, { age: 30 }, undefined])
// =>[{ name: 'Alice' }, { age: 30 }]
```

## 💭 分析與思路

基本上用 filter 就可以秒殺了：

```ts
const compact = <T>(array: T[]) => array.filter((a) => !!a);
```

不過看了答案後才知道原來還能更短：

```ts
const compact = <T>(array: T[]) => array.filter(Boolean);
```

也補個簡單的單元測試，要注意空物件與空陣列不是 falsy value：

```ts
import { describe, expect, it } from 'vitest';
import compact from './compact';

describe('compact', () => {
  it('should remove falsy values', () => {
    expect(
      compact([
        0,
        1,
        false,
        2,
        '',
        3,
        NaN,
        null,
        {
          name: 'codefarmer',
          age: 18,
        },
        {},
        [],
      ])
    ).toEqual([1, 2, 3, { name: 'codefarmer', age: 18 }, {}, []]);
  });
});
```
