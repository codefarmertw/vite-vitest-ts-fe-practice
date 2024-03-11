import { describe, expect, test } from 'vitest';
import { sleep } from './sleep';

describe('sleep', () => {
  test('should await with sleep function using await', async () => {
    const start = Date.now();
    await sleep(3000);
    const end = Date.now();

    // assert
    console.log(end - start);
    expect(end - start).toBeGreaterThanOrEqual(3000);
  });

  test('should await with sleep function using then', () => {
    const start = Date.now();
    sleep(3000).then(() => {
      const end = Date.now();

      // assert
      expect(end - start).toBeGreaterThanOrEqual(3000);
    });
  });
});
