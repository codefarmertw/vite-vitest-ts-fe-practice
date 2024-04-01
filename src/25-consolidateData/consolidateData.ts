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

export default consolidateData2;
