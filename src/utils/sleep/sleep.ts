import { PROMISE_STATE } from './enum';

interface SleepParams<T> {
  duration: number;
  value: T;
  state: PROMISE_STATE;
}

const sleep = <T>({ duration, value, state }: SleepParams<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === PROMISE_STATE.FULFILLED) {
        resolve(value);
      } else {
        reject(value);
      }
    }, duration);
  });
};

export default sleep;

export class CancelableSleep<T> {
  private timeoutId: number;
  private isCancelled: boolean;

  constructor(private params: SleepParams<T>) {
    this.timeoutId = 0;
    this.isCancelled = false;
  }

  public sleep(): Promise<T | Error> {
    return new Promise((resolve, reject) => {
      const { duration, value, state } = this.params;

      this.timeoutId = setTimeout(() => {
        if (this.isCancelled) {
          reject(new Error('Sleep cancelled'));
        } else if (state === PROMISE_STATE.FULFILLED) {
          resolve(value);
        } else {
          reject(new Error('Sleep promise rejected'));
        }
      }, duration);
    });
  }

  public cancel(): void {
    clearTimeout(this.timeoutId);
    this.isCancelled = true;
  }
}

export class CancelableSleepWithAbortController<T> {
  private controller = new AbortController();

  sleep = ({ duration, value, state }: SleepParams<T>) => {
    return new Promise<T | Error>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (state === PROMISE_STATE.FULFILLED) {
          resolve(value);
        } else {
          reject(new Error('Sleep promise rejected'));
        }
      }, duration);

      this.controller.signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new Error('Aborted'));
      });
    });
  };

  cancel = () => {
    this.controller.abort();
  };
}
