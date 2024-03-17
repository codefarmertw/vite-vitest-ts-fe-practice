import { describe, expect, it } from 'vitest';
import cancelableTimeout from './cancelableTimeout';

describe('cancelableTimeout', function () {
  it('should get result if the timeout less than the cancel duration', async function () {
    const fn = (x: number) => x * 5;
    const args = [2];
    const timeout = 20;

    const cancelTimeMs = 50;
    const { cancel, fnResult } = cancelableTimeout<number[], number>(fn, args, timeout);

    try {
      const res = await fnResult;
      expect(res).toBe(10);
    } catch (error) {
      expect(error).toBeUndefined();
    }

    setTimeout(cancel, cancelTimeMs);
  });

  it('should reject if the timeout is larger than the cancel duration', async function () {
    const fn = (x: number) => x * 5;
    const args = [2];
    const timeout = 50;

    const cancelTimeMs = 20;
    const { cancel, fnResult } = cancelableTimeout<number[], number>(fn, args, timeout);

    try {
      await fnResult;
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe('fn has been canceled!');
      }
    }

    setTimeout(cancel, cancelTimeMs);
  });

  it('should resolve with multiple arguments', async function () {
    const fn = (x: string, y: number, z: number) => x + y * z;
    const args: [string, number, number] = ['100', 3, 5];
    const timeout = 20;

    const cancelTimeMs = 50;
    const { cancel, fnResult } = cancelableTimeout<[string, number, number], string>(
      fn,
      args,
      timeout
    );

    try {
      const res = await fnResult;
      expect(res).toBe('10015');
    } catch (error) {
      expect(error).toBeUndefined();
    }

    setTimeout(cancel, cancelTimeMs);
  });
});
