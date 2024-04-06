# 22. `Easy` 實作 Array.filter

## 🔸 題目描述

給定一個整數陣列 `arr` 和一個過濾函式 `fn`，回傳一個過濾後的陣列 `filteredArr`。

函式 `fn` 接受一個或兩個參數：

- `arr[i]`  是來自 `arr` 的數字
- `i` 是 `arr[i]` 的索引

`filteredArr` 應該只包含來自 `arr` 的元素，其中表達式 `fn(arr[i], i)` 評估為真值。真值是指 `Boolean(value)` 返回 `true` 的值。此題不得使用 JavaScript 內建的 `Array.filter` 方法來解。

```javascript
// 範例一
輸入: arr = [0,10,20,30], fn = function greaterThan10(n) { return n > 10; }
輸出: [20, 30]
解說:
const newArray = filter(arr, fn); // [20, 30]
該函式把沒有大於 10 的數字過濾掉

// 範例二
輸入: arr = [1, 2, 3], fn = function firstIndex(n, i) { return i === 0; }
輸出: [1]
解說:
fn 也可以接受每個元素的索引，在這個案例中，該函式把索引不等於 1 的數字過濾掉
```

## 💭 分析與思路

### 問題釐清

- 傳入的陣列的值是否限制為只有 number
- 其他相對明確，就是作出一個類似 array.filter 的方法即可

### 提出測試案例

- 能通過基本測資
- 能確認 fn 傳不傳第二個參數的正確性
- 能列出一些 edge case，如空陣列、fn 結果都不符合等狀況

### 提出思路

- 用 for 迴圈對 arr 迭代，並執行 fn 確認是否為 truthy，是的話則放入準備回傳的結果陣列

### 實作

雖然一開始限制只用 number，但發現其實也是改成泛型可以支援各種型別：

```ts
const filter = <T>(arr: T[], fn: (n: T, i: number) => boolean) => {
  const res: T[] = [];

  // 用 for 迴圈對 arr 迭代，並執行 fn 確認是否為 truthy，是的話則放入準備回傳的結果陣列
  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i], i)) {
      res.push(arr[i]);
    }
  }

  return res;
};

export default filter;
```

或是想用 reduce 縮寫也可：

```ts
const filterWithReduce = <T>(arr: T[], fn: (n: T, i: number) => boolean) => {
  return arr.reduce<T[]>((accu, curr, index) => {
    if (fn(curr, index)) {
      accu.push(curr);
    }

    return accu;
  }, []);
};
```

今天放假中，來題簡單的，但好像跟前面有些題目類型重複沒學到什麼新東西，明天如果有更多時間來題 medium 好了。
