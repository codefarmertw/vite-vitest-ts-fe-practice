import { describe, expect, it } from 'vitest';
import promiseWithTimeLimit, {
  type RejectedResultType,
  type ResolvedResultType,
} from './promiseWithTimeLimit';

describe('promise with time limit', () => {
  it('should be rejected when time limit exceeded', async () => {
    const fn = async (n: number) => {
      await new Promise((res) => setTimeout(res, 100));
      return n * n;
    };
    const inputs: [number] = [5];
    const t = 50;

    const limitedFn = promiseWithTimeLimit(fn, t);

    try {
      await limitedFn(...inputs);
    } catch (error) {
      const { rejected, time } = error as RejectedResultType;

      expect(rejected).toEqual('Time Limit Exceeded');
      expect(time).toBeGreaterThanOrEqual(t);
    }
  });

  it('should be resolved when time limit not exceeded', async () => {
    const fn = async (n: number) => {
      await new Promise((res) => setTimeout(res, 100));
      return n * n;
    };
    const inputs: [number] = [5];
    const t = 150;

    const limitedFn = promiseWithTimeLimit(fn, t);

    try {
      const { resolved, time } = (await limitedFn(
        ...inputs
      )) as ResolvedResultType<number>;

      expect(resolved).toEqual(25);
      expect(time).toBeLessThanOrEqual(t);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should check promiseWithTimeLimit works with multiple arguments and same time limit', async () => {
    const fn = async (x: string, y: number) => {
      await new Promise((res) => setTimeout(res, 100));
      return x + y;
    };
    const inputs: [string, number] = ['10', 10];
    const t = 100;

    const limitedFn = promiseWithTimeLimit(fn, t);

    try {
      const { resolved, time } = (await limitedFn(
        ...inputs
      )) as ResolvedResultType<string>;

      expect(resolved).toEqual('1010');
      expect(time).toBeLessThanOrEqual(t);
    } catch (error) {
      const { rejected, time } = error as RejectedResultType;

      expect(rejected).toEqual('Time Limit Exceeded');
      expect(time).toBeGreaterThanOrEqual(t);
    }
  });
});
