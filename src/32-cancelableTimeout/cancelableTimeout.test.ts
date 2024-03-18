import { describe, expect, it, vi, beforeEach, afterEach  } from 'vitest';
import cancelableTimeout from './cancelableTimeout';

describe('cancelableTimeout', function () {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should get result if the timeout less than the cancel duration', async function () {
    const fn = vi.fn((x: number) => x * 5);
    const args = [2];
    const timeout = 20;

    const cancelTimeMs = 50;
    const { cancel, output } = cancelableTimeout<number[], number>(fn, args, timeout);
    setTimeout(cancel, cancelTimeMs);

    // wait for the cancel to be called with fake timers
    vi.advanceTimersByTime(cancelTimeMs * 2);

    // assert the output
    expect(output).toEqual([
      { time: 20, returned: 10 },
    ]);

    // assert the fn should be called 1 times
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should reject if the timeout is larger than the cancel duration', async function () {
    const fn = vi.fn((x: number) => x * 5);
    const args = [2];
    const timeout = 50;

    const cancelTimeMs = 20;
    const { cancel, output } = cancelableTimeout<number[], number>(fn, args, timeout);
    setTimeout(cancel, cancelTimeMs);

    // wait for the cancel to be called with fake timers
    vi.advanceTimersByTime(cancelTimeMs * 2);

    expect(output).toEqual([]);
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('should resolve with multiple arguments', async function () {
    const fn = vi.fn((x: string, y: number, z: number) => x + y * z);
    const args: [string, number, number] = ['100', 3, 5];
    const timeout = 20;

    const cancelTimeMs = 50;
    const { cancel, output } = cancelableTimeout<[string, number, number], string>(
      fn,
      args,
      timeout
    );

    // wait for the cancel to be called with fake timers
    vi.advanceTimersByTime(cancelTimeMs * 2);

    expect(output).toEqual([
      { time: 20, returned: '10015' },
    ]);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
