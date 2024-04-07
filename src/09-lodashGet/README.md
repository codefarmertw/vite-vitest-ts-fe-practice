# 9. `Medium` 手寫 lodash.get

## 🔸 題目描述

實作一個 `get` 效用函式。它接收三個參數

- 一個物件
- 某個路徑
- 預設值

而此函式最後會返回路徑的值；如果該路徑不存在於給定的物件，則返回預設值。透過例子會比較好理解：

```javascript
// 範例
const object = { a: [{ b: { c: 3 } }] };

//=> 3
get(object, "a[0].b.c");

//=> 3
get(object, 'a[0][b][c]');

//=> 'default'
get(object, "a[100].b.c", "default");
```

## 💭 分析與思路

### 問題釐清

- 傳入的參數中，只有 defaultValue 是 optional 的嗎?
- 若路徑找完後不存在，且沒有 defaultValue 的話要返回 undefined?
- 輸出的值若是物件，需要拷貝一份或是要能與原值參考位址相同

### 提出測試案例

- 能通過基本測資
- 上面的問題釐清中，參考了原始 [lodash.get](https://lodash.com/docs/4.17.15#get) 文件，發現有幾點是可以注意的：
  - pathParam 可以是 string 或 array，像是 `a[0][b][c]` 與 `[‘a‘, ‘0‘, ‘b‘, ‘c‘]` 同意
  - defaultValue 是可選輸入
  - 若找不到且沒有 defaultValue 則回傳 undefined
  - 找到的值若為物件，則回傳原值即可
- 測試若傳入的 object 為非法值，則回傳 defaultValue 或 undefined
- 如果路徑是空字串，則回傳 defaultValue 或 undefined

### 提出思路

- 對輸入參數用 TypeScript 定型
- 處理 pathParam：
  - 確認型別是否為 `string[]` 若是則直接使用
  - 若型別為字串，則用 split 來 parse 路徑，能抓出 `[‘a‘, ‘0‘, ‘b‘, ‘c‘]` 這樣的格式
- 對上面處理完成的 pathParam 陣列從頭開始迭代，依序造訪 object 裡的 key，直到抓出目標值
- 若找不到值，最後確認是否有 defaultValue，否則回傳 undefined

```ts
const get = <T, D>(object: T, pathParam: string | string[], defaultValue?: D) => {
  // 處理 pathParam：
  // 確認型別是否為 string[] 若是則直接使用
  // 若型別為字串，則用 split 來 parse 路徑，能抓出 [‘a‘, ‘0‘, ‘b‘, ‘c‘] 這樣的格式
  // 對上面處理完成的 pathParam 陣列從頭開始迭代，依序造訪 object 裡的 key，直到抓出目標值
  // 若找不到值，最後確認是否有 defaultValue，否則回傳 undefined
};
```

### 實作

```ts
const castPathParam = (pathParam: string | string[]) => {
  // 確認型別是否為 string[] 若是則直接使用
  if (Array.isArray(pathParam)) {
    return pathParam;
  }

  // 若型別為字串，則用 split 來 parse 路徑，能抓出 [‘a‘, ‘0‘, ‘b‘, ‘c‘] 這樣的格式
  if (typeof pathParam === 'string') {
    // 用 split 處理 . 與 ] 分隔的字串
    const pathArray = pathParam
      .split('.')
      .map((str) => str.split(']'))
      .flat();

    const result = pathArray.reduce<string[]>((accu, curr) => {
      if (curr.includes('[')) {
        // 處理 [] 分隔的字串
        const [key, index] = curr.split('[');

        return [...accu, key, index];
      }

      return [...accu, curr];
    }, []);

    return result.filter((str) => str !== '');
  }

  // 若不是 string 或 string[] 則 throw error
  throw new Error('[get] pathParam must be string or string array');
};

const get = <T, D>(object: T, pathParam: string | string[], defaultValue?: D) => {
  // 處理輸入值的 edge case
  if (!pathParam || pathParam.length === 0 || !object) {
    return defaultValue;
  }

  // 處理 pathParam
  const pathArray = castPathParam(pathParam);

  // 對上面處理完成的 pathParam 陣列從頭開始迭代，依序造訪 object 裡的 key，直到抓出目標值
  return pathArray.reduce<any>((accu, key) => {
    if (typeof accu !== 'object' || accu?.[key] === undefined) {
      return defaultValue;
    }

    return accu?.[key] ?? defaultValue;
  }, object);
};
```

這題稍微複雜一些，也來回補了一些 edge case 與防呆最後整理成上面的版本，也稍微說明一下：

- 將字串 parse 處理的部分拆出去另一個名為 `castPathParam` 的 function處理：
  - 若型別為字串，則要處理 `.` 與 `[]` 的字串解析
  - 這裡直接對 split 後的 string array 再處理用 `]` 去 split 一次，最後用 flat 攤平，否則會變成二維陣列
  - 最後用 reduce 去確認如果含有 `[` 則再切一次分開
- 上面字串處理其實算整題最複雜的地方，當這沒問題後，剩下就是迭代取值，但這邊 reduce 的型別可能可以是 `D` 、`undefined` 、`Record<string, unknown>` 等，稍微有點懶得處理各種型別判斷，索性就先用 any 了 🥹
- 最後補上如 path 為 falsy value 或空陣列、object 為 falsy value 的防呆

單元測試的部分這題稍微複雜一些，除了 basic case 一開始確認能通過外，也補上不少 edge case，可直接參考[這個連結](./get.test.ts) 。

後來看了解答後發現其實字串處理的部分可以改成正規表達來簡化，一開始沒想到：

```ts
const castPathParam = (pathParam: string | string[]) => {
  // 確認型別是否為 string[] 若是則直接使用
  if (Array.isArray(pathParam)) {
    return pathParam;
  }

  // 若型別為字串，則用 split 來 parse 路徑，能抓出 [‘a‘, ‘0‘, ‘b‘, ‘c‘] 這樣的格式
  if (typeof pathParam === 'string') {
    // 用 split 處理 . 與 [] 分隔的字串
    return pathParam.split(/[\.\[\]]/).filter((str) => str !== '');
  }

  // 若不是 string 或 string[] 則 throw error
  throw new Error('[get] pathParam must be string or string array');
};
```

也好奇看了原始的 [lodash.get](https://github.com/lodash/lodash/blob/4.4.2-npm-packages/lodash.get/index.js#L457) 有夠長，但基本上作法跟原始 ExplainThis 的答案版本比較接近，是用路徑長度來迭代判斷最後的輸出值，只是把許多共用邏輯做了更多抽象化，以及擋了更多的 edge case。
