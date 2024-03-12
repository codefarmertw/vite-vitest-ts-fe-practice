import { describe, expect, test } from 'vitest';
import * as utils from './deduplication';

const arr = [9, 1, 2, 2, 3, 4, 2, 4, 8, 1, 9];
const assert = (result: number[]) => expect(result).toEqual([9, 1, 2, 3, 4, 8]);

describe('deduplication suite', () => {
  test('should remove duplicates from an array - array methods', () => {
    assert(utils.deduplicationWithReduce(arr));
  });

  test('should remove duplicates from an array - object map', () => {
    assert(utils.deduplicationWithObject(arr));
  });

  test('should remove duplicates from an array - set', () => {
    assert(utils.deduplicationWithSet(arr));
  });
});
