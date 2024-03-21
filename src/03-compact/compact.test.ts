import { describe, expect, it } from 'vitest';
import compact from './compact';

describe('compact', () => {
  it('should remove falsy values', () => {
    expect(
      compact([
        0,
        1,
        false,
        2,
        '',
        3,
        NaN,
        null,
        {
          name: 'codefarmer',
          age: 18,
        },
        {},
        [],
      ])
    ).toEqual([1, 2, 3, { name: 'codefarmer', age: 18 }, {}, []]);
  });
});
