# 25. `Medium` 手寫 consolidateData (整合數據)

## 🔸 題目描述

假設你正在開發一款閱讀 App，該 App 追蹤用戶的閱讀相關紀錄，會有以下格式記錄的資料：

```javascript
const sessions = [
  { user: 8, duration: 50, books: ['The Hobbit'] },
  { user: 7, duration: 150, books: ['Pride and Prejudice'] },
  { user: 1, duration: 10, books: ['The Lord of the Rings'] },
  { user: 7, duration: 100, books: ['The Great Gatsby', 'Animal Farm'] },
  { user: 7, duration: 200, books: ['The Great Gatsby'] },
  { user: 2, duration: 200, books: ['1984'] },
  { user: 2, duration: 200, books: ['The Great Gatsby'] },
];
```

每個物件都有以下欄位：

- `user`：讀者的用戶 ID。
- `duration`：閱讀的持續時間，以分鐘為單位。
- `books`：閱讀的書籍標題，以陣列形式按字母排序。

現在你需要實作一個 `consolidateData` 函式，來合併每個用戶的閱讀資料，合併規則如下：

1. 將相同用戶的資料合併為單一物件。
2. 將合併的 `duration` 欄位相加。
3. 合併 `books` 陣列，移除重複書名，並按字母順序排序。
4. 保持結果的原始順序。
5. 如果多筆資料屬於同一用戶，合併後的應取代原始集合中該用戶最早出現的位置。
6. 不要修改輸入物件。

上述的範例輸入，預期會有以下輸出

```javascript
[
  { user: 8, duration: 50, books: ['The Hobbit'] },
  { user: 7, duration: 450, books: ['Animal Farm', 'Pride and Prejudice', 'The Great Gatsby'] },
  { user: 1, duration: 10, books: ['The Lord of the Rings'] },
  { user: 2, duration: 400, books: ['1984', 'The Great Gatsby'] },
];

```

## 💭 分析與思路

### 問題釐清

題目規格算蠻清楚的，有幾個重點：

- books 要 deduplication，並依照字母順序排序
- 依照原始的 user id 排序
- 回傳一個新物件
- 因為是應用的資料轉換，就用 TS 來幫忙做型別檢查，不另外防呆

### 提出測試案例

- 使用題目測資，確認輸出物件內容能與期待相同
- 確認輸出物件為新物件
- 確認空陣列應得到空陣列

```ts
import { describe, expect, it } from 'vitest';
import consolidateData from './consolidateData';

const mockSessions = [
  { user: 8, duration: 50, books: ['The Hobbit'] },
  { user: 7, duration: 150, books: ['Pride and Prejudice'] },
  { user: 1, duration: 10, books: ['The Lord of the Rings'] },
  { user: 7, duration: 100, books: ['The Great Gatsby', 'Animal Farm'] },
  { user: 7, duration: 200, books: ['The Great Gatsby'] },
  { user: 2, duration: 200, books: ['1984'] },
  { user: 2, duration: 200, books: ['The Great Gatsby'] },
];

const expectedResult = [
  { user: 8, duration: 50, books: ['The Hobbit'] },
  {
    user: 7,
    duration: 450,
    books: ['Animal Farm', 'Pride and Prejudice', 'The Great Gatsby'],
  },
  { user: 1, duration: 10, books: ['The Lord of the Rings'] },
  { user: 2, duration: 400, books: ['1984', 'The Great Gatsby'] },
];

describe('consolidate sessions data', () => {
  it('should pass basic test cases', () => {
    const result = consolidateData(mockSessions);

    expect(result).toEqual(expectedResult);
    expect(result).not.toBe(mockSessions);
  });

  it('should pass edge cases', () => {
    const result = consolidateData([]);

    expect(result).toEqual([]);
  });
});
```

### 提出思路

- 寫一個 util function `consolidateData` 並定義輸入、輸出型別
- 對輸入 sessions 陣列用 reduce 迭代，用 object map 的方式存值，key 為 user id，方便查找 user id 是否存在的複雜度：
  - user 不存在塞新 object 並迭代下一個
  - user 存在則調整原 object 對 duration 相加、concat book 陣列
- 最後對這個 reduce 迭代後的 object map 取 Object.values，並對 books 用 Set 去重複並排序

```ts
interface Session {
  user: number;
  duration: number;
  books: string[];
}

const consolidateData = (sessions: Session[]) => {
  // 對 sessions 迭代，並用 map 的方式存資料，方便查找 user 是否存在
  // 檢查 user 是否存在，否則塞新物件，並迭代下一個
  // user 存在則處理 duration 及 books concat
  // 最後處理原 session 排序、books 排序與去重複問題
};

export default consolidateData;
```

### 實作

```ts
interface Session {
  user: number;
  duration: number;
  books: string[];
}

interface SessionWithOrder extends Session {
  order: number;
}

const consolidateData = (sessions: Session[]) => {
  // 用來做最後輸出的原 session 排序
  let order = 0;

  // 對 sessions 迭代，並用 map 的方式存資料，方便查找 user 是否存在
  const resultMap = sessions.reduce<Record<string, SessionWithOrder>>(
    (accumulator, session) => {
      const { user, duration, books } = session;
      // 檢查 user 是否存在，否則塞新物件，並迭代下一個
      if (!accumulator[user]) {
        accumulator[user] = {
          ...session,
          order,
        };
        // 利用 order 紀錄最後輸出的排序
        order++;

        return accumulator;
      }

      // user 存在則處理 duration 及 books concat
      const prevSession = accumulator[user];

      accumulator[user] = {
        ...prevSession,
        duration: prevSession.duration + duration,
        books: prevSession.books.concat(books),
      };

      return accumulator;
    },
    {}
  );

  // 處理原 session 排序、books 排序與去重複問題
  return Object.values(resultMap)
    .sort((a, b) => a.order - b.order)
    .map(({ user, books, duration }) => ({
      user,
      duration,
      books: Array.from(new Set(books)).sort(),
    }));
};

export default consolidateData;
```

上述方法在感覺是可以再優化，也好奇複雜度有多少，假設 session 陣列長 n，books 最長為 m：

- reduce 迭代 → `O(n)`
  - 查找 user → `O(1)`
- Object.values → `O(n)`
- sort → `O(n log n)`
- map 裡去 sort books → `O(n * m log m)`

最後的時間複雜度合計是：

```javascript
O(n*1 + n + n*logn + n*m*logm ) -> O(N^2 * log N)
```

後來看了參考答案，看起來更簡潔易讀，用 Set 來存看過的 users 做 cache，並直接在當層迴圈內去處理 books 的去重複與排序：

```javascript
function consolidateData(sessions) {
  const mergedData = [];
  const seenUsers = new Set();

  for (const session of sessions) {
    const userId = session.user;

    if (seenUsers.has(userId)) {
      const existingIndex = mergedData.findIndex((user) => user.user === userId);

      mergedData[existingIndex].duration += session.duration;
      mergedData[existingIndex].books = Array.from(
        new Set([...mergedData[existingIndex].books, ...session.books])
      ).sort();
    } else {
      mergedData.push({
        user: userId,
        duration: session.duration,
        books: session.books,
      });
      seenUsers.add(userId);
    }
  }

  return mergedData;
}
```

也好奇算一下複雜度：

- 外層迴圈 → `O(n)`
  - seenUsers 查找 → `O(1)`
  - findIndex → `O(x)`
  - books 去重複與 sort → `O(m * logm)`

最後的時間複雜度合計是：

```javascript
O(n*(1 + x + (m * logm)) ) -> O(N * X + N^2 * log N)
```

複雜度看起來也趨近於是 `O(N^2 * log N)`，沒實際跑效能測試，但以經驗看起來當今天 X 也極大時，也就是不重複的 user 資料較多的狀況，在猜有可能會慢一些，就差在 `mergedSessions.findIndex` 這段。

但這也是極端案例，以一般量級的系統來說，我自己應該還是會選擇後者這種可讀性較好的寫法，順便練習改寫一下：

```ts
const consolidateData2 = (sessions: Session[]) => {
  const seenUsers = new Set<number>();

  return sessions.reduce<Session[]>((mergedSessions, session) => {
    const { user, duration, books } = session;

    if (!seenUsers.has(user)) {
      mergedSessions.push({
        ...session,
      });
      seenUsers.add(user);

      return mergedSessions;
    }

    const targetIndex = mergedSessions.findIndex((s) => s.user === user);
    const prevSession = mergedSessions[targetIndex];

    mergedSessions[targetIndex] = {
      ...prevSession,
      duration: prevSession.duration + duration,
      books: Array.from(new Set([...prevSession.books, ...books])).sort(),
    };

    return mergedSessions;
  }, []);
};
```
