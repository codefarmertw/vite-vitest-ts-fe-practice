# 30 天前端程式題挑戰

## 這是什麼？

前陣子趁早鳥時有訂閱 ExplainThis 的 E+ 社群，而在 3 月初時他們釋出了 [50 題前端手寫練習題](https://explainthisio.notion.site/ExplainThis-50-8fe7055e22d5467586f7d2c22719684f)，並嘗試性地在社群中發起小組性的打卡群挑戰，雖然我原本只是潛水員，但看到我的面試進度一直在拖延中，想說借住社群的力量跟大家一起打卡挑戰，看能不能養成開始刷題的習慣。

## 進行方式

- 第一期有 12 人參加
- 活動期間：3/10 ~ 4/14 (清明連假暫停打卡)
- 打卡期間至少練習過 30 道題目，不要求要解出，但要能嘗試練習過
- 每天到 DC 群組打卡「完成第 X 題，累積 Y 題」，並將解法思路筆記貼到對應題號討論區，並到 google sheet 上更新該題號狀況
- 共 3 次線上活動，說明&相見歡及 2 次 office hour 會解說大家在 google sheet 上想聽解析的題目

## Tech-stack

瀏覽了 50 題的內容，想說應該還可以掌握，想順便玩玩新東西，而因為寫這種 util 類的題目，之前遇過有公司面試會使用類似 TDD 的方式在 CodeSandbox 先提前準備好 unit test 測資，並希望能完成主程式來讓所有測資 all pass。

因此起了這個 repo，順便玩玩 Vitest 看看寫起來與 jest 有何不同，參考官方文件設定了一番，也順便記錄一下：

```shell
$ pnpm add -g pnpm # 只是想更新一下 pnpm version

$ pnpm create vite
    -> 選 vanilla、TypeScript

$ cd vite-vitest-ts
$ pnpm i
$ pnpm add -D vitest
```

最後將這段放上 `package.json` 就完工了：

```json
"scripts": {
    "test": "vitest"
},
```

接下來就能在之後幾天用以下每個資料夾的結構來練習寫單元測試及完成手寫題，並完成思路筆記。

搭配 `pnpm run test` 可以執行所有的測試，確認主程式是否能通過能正確涵蓋所有測資。

## 解題進度

- Day01 - [29 - `Easy` sleep](src/29-sleep)
- Day02 - [17 - `Easy` Remove Duplicates](src/17-deduplication)
- Day03 - [30 - `Easy` Promise.race](src/30-promise-race)
- Day04 - [01 - `Easy` lodash.clamp](src/01-clamp)
- Day05 - [02 - `Easy` inRange](src/02-inRange)
- Day06 - [31 - `Easy` add promises](src/31-addPromises)
- Day07 - [32 - `Easy` cancelable timeout](src/32-cancelableTimeout)
- Day08 - [33 - `Easy` cancelable interval](src/33-cancelableInterval)
- Day09 - [34 - `Medium` repeat](src/34-repeat)
- Day10 - [05 - `Easy` lodash.dropWhile](src/05-dropWhile)
- Day11 - [03 - `Easy` lodash.compact](src/03-compact)
- Day12 - [04 - `Easy` lodash.difference](src/04-difference)
- Day13 - [35 - `Medium` functions Promise.all](src/35-promiseAll)
- Day14 - [06 - `Easy` lodash.dropRightWhile](src/06-dropRightWhile)
