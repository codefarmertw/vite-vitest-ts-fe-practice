import { PROMISE_STATE } from './enum';

interface SleepParams<T> {
  duration: number;
  value: T;
  state: PROMISE_STATE;
}

const sleep = <T>({ duration, value, state }: SleepParams<T>): Promise<T> =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (state === PROMISE_STATE.FULFILLED) {
        resolve(value);
      } else {
        reject(value);
      }
    }, duration)
  );

export default sleep;
