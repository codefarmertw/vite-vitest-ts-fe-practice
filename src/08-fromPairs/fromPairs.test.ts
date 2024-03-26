import { describe, expect, it } from 'vitest';
import { fromPairs3 as fromPairs } from './fromPairs';

describe('lodash.fromPairs', () => {
  it('should return an object in basic usage', () => {
    const pairs = [
      ['code', 'farmer'],
      ['try', 'to'],
      ['keep', 'growing'],
    ];

    expect(fromPairs(pairs)).toEqual({ code: 'farmer', try: 'to', keep: 'growing' });
  });

  it('should filter out invalid key', () => {
    const pairs = [
      [null, 'null'],
      [undefined, 'undefined'],
      [0, 'zero'],
      [3.14, 'floating number'],
    ];

    expect(fromPairs(pairs)).toEqual({
      null: 'null',
      undefined: 'undefined',
      '0': 'zero',
      '3.14': 'floating number',
    });
  });

  it('should filter out invalid value at second level', () => {
    const pairs = [['code', 'farmer'], ['try'], ['keep', 'growing']];

    expect(fromPairs(pairs)).toEqual({ code: 'farmer', keep: 'growing' });
  });

  it('should process key with Symbol', () => {
    const pairs = [
      [Symbol.for('symbol'), 'symbol1'],
      [Symbol.for('symbol'), 'symbol2'],
    ];

    expect(fromPairs(pairs)).toEqual({
      [Symbol.for('symbol')]: 'symbol1',
      [Symbol.for('symbol')]: 'symbol2',
    });
  });
});
