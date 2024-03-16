import { describe, expect, it } from 'vitest';
import promiseRace from './promiseRace';
import sleep, { PROMISE_STATE } from '../utils/sleep';

const fastPromiseParams = {
  duration: 100,
  value: 'fast',
  state: PROMISE_STATE.FULFILLED,
};
const slowPromiseParams = {
  duration: 500,
  value: 'slow',
  state: PROMISE_STATE.FULFILLED,
};

describe('Promise.race', function () {
  it('basic: resolve with the faster promise', async () => {
    const fastPromise = sleep({ ...fastPromiseParams });
    const slowPromise = sleep({ ...slowPromiseParams });
    const result = await promiseRace([fastPromise, slowPromise]);

    expect(result).toBe('fast');
  });

  it('if the faster promise is resolved, the slower promise should be ignored', async () => {
    const fastPromise = sleep({ ...fastPromiseParams });
    const slowPromise = sleep({
      ...slowPromiseParams,
      state: PROMISE_STATE.REJECTED,
    });

    let result;

    try {
      result = await promiseRace([fastPromise, slowPromise]);
    } catch (error) {
      result = error;
    }

    expect(result).toBe('fast');
  });

  it('if the faster promise is rejected, the slower promise should be ignored', async () => {
    const fastPromise = sleep({
      ...fastPromiseParams,
      state: PROMISE_STATE.REJECTED,
    });
    const slowPromise = sleep({ ...slowPromiseParams });

    let result;

    try {
      result = await promiseRace([fastPromise, slowPromise]);
    } catch (error) {
      result = error;
    }

    expect(result).toBe('fast');
  });

  it('multiple promises: resolve with the faster promise', async () => {
    const promises = [];

    for (let i = 1; i < 10; i++) {
      promises.push(
        sleep({ duration: 1000 * i, value: i, state: PROMISE_STATE.FULFILLED })
      );
    }
    const result = await promiseRace(promises);

    expect(result).toBe(1);
  });

  it('edge case: should throw an error if no promise is passed', async () => {
    let result;

    try {
      result = await promiseRace([]);
    } catch (error) {
      result = error;
    }

    expect(result).toBeInstanceOf(Error);
    expect(result).toHaveProperty('message', 'No promise was passed');
  });
});
