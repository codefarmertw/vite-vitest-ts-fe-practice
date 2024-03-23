import { describe, expect, it } from 'vitest';
import promiseAll from './promiseAll';

describe('promiseAll', () => {
  it('should get the result of single promise', async () => {
    const promise1 = () => new Promise((resolve) => setTimeout(() => resolve(5), 200));
    const functions = [promise1];

    const start = performance.now();
    const results = await promiseAll(functions);
    const end = performance.now();

    expect(results).toEqual([5]);
    expect(end - start).toBeGreaterThanOrEqual(200);
  });

  it('should get rejected result if any promise is rejected', async () => {
    const promise1 = () => new Promise((resolve) => setTimeout(() => resolve(1), 200));
    const promise2 = () =>
      new Promise((_, reject) => setTimeout(() => reject('Error'), 100));
    const functions = [promise1, promise2];

    const start = performance.now();
    try {
      await promiseAll(functions);
    } catch (error) {
      if (typeof error === 'string') {
        expect(error).toBe('Error');
      }
    } finally {
      const duration = performance.now() - start;
      expect(duration).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThan(200);
    }
  });

  it('should get the correct order and time when multiple promises all resolved', async () => {
    const promise1 = () => new Promise((resolve) => setTimeout(() => resolve(4), 50));
    const promise2 = () => new Promise((resolve) => setTimeout(() => resolve(10), 150));
    const promise3 = () => new Promise((resolve) => setTimeout(() => resolve(16), 100));
    const functions = [promise1, promise2, promise3];

    const start = performance.now();
    const results = await promiseAll(functions);
    const end = performance.now();

    expect(results).toEqual([4, 10, 16]);
    expect(end - start).toBeGreaterThanOrEqual(150);
  });

  it('should get empty array if no promise is provided', async () => {
    const results = await promiseAll([]);

    expect(results).toEqual([]);
  });
});
