import { describe, expect, test } from 'vitest';
import get from './get';

const basicCases = [
  {
    object: {
      a: [
        {
          b: {
            c: 3,
          },
        },
      ],
    },
    path: 'a[0].b.c',
    expected: 3,
  },
  {
    object: {
      a: [
        {
          b: {
            c: 3,
          },
        },
      ],
    },
    path: 'a[0][b][c]',
    expected: 3,
  },
  {
    object: {
      a: [
        {
          b: {
            c: 3,
          },
        },
      ],
    },
    path: ['a', '0', 'b', 'c'],
    expected: 3,
  },
  {
    object: {
      a: [
        {
          b: {
            c: 3,
          },
        },
      ],
    },
    path: 'a[100].b.c',
    defaultValue: 'default',
    expected: 'default',
  },
  {
    object: {
      a: [
        {
          b: {
            c: 3,
          },
        },
      ],
    },
    path: 'a[100].b.c',
    expected: undefined,
  },
  {
    object: {
      a: [
        {
          b: {
            c: 3,
          },
        },
      ],
    },
    path: 'a[0].b',
    expected: {
      c: 3,
    },
  },
];

const edgeCases = [
  {
    object: {
      a: [
        {
          b: {
            c: 3,
          },
        },
      ],
    },
    path: '',
    expected: undefined,
  },
  {
    object: {
      a: [
        {
          b: {
            c: 3,
          },
        },
      ],
    },
    path: [],
    expected: undefined,
  },
  {
    object: [10, 20, 30, 40, 50, 60],
    path: '[4]',
    defaultValue: 'default',
    expected: 50,
  },
  {
    object: null,
    path: 'a',
    defaultValue: 'default',
    expected: 'default',
  },
  {
    object: null,
    path: 'a',
    expected: undefined,
  },
  {
    object: {
      a: [
        {
          b: {
            c: 3,
          },
        },
      ],
    },
    path: 'b[]]]]]]][][][NaN]',
    expected: undefined,
  },
  {
    object: {},
    path: 'a',
    expected: undefined,
  },
  {
    object: {},
    path: 12345,
    expected: undefined,
  },
  {
    object: {
      a: [
        {
          b: {
            c: 3,
          },
        },
      ],
    },
    path: 'a[100].b.c',
    defaultValue: {
      d: {
        e: 5,
      },
    },
    expected: {
      d: {
        e: 5,
      },
    },
  },
];

describe('lodash.get', () => {
  test.each(basicCases)(
    'should pass basic test cases - %s',
    ({ object, path, defaultValue, expected }) => {
      const result = get(object, path, defaultValue);

      if (typeof expected === 'object') {
        expect(result).toEqual(expected);
      } else {
        expect(result).toBe(expected);
      }
    }
  );

  test.each(edgeCases)(
    'should pass edge cases - %s',
    ({ object, path, defaultValue, expected }) => {
      try {
        const result = get(object, path, defaultValue);

        if (typeof expected === 'object') {
          expect(result).toEqual(expected);
        } else {
          expect(result).toBe(expected);
        }
      } catch (error) {
        expect(error).toBeInstanceOf(Error);

        if (error instanceof Error) {
          expect(error.message).toBe('[get] pathParam must be string or string array');
        }
      }
    }
  );
});
