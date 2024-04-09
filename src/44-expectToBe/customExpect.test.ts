import { describe, expect, test } from 'vitest';
import customExpect from './customExpect';

const testCases = [
  {
    title: 'toBe - positive case',
    assert: () => customExpect(5).toBe(5),
  },
  {
    title: 'toBe - negative case',
    assert: () => customExpect(5).toBe(10),
    expectedError: 'Not Equal',
  },
  {
    title: 'notToBe - positive case',
    assert: () => customExpect(5).notToBe(10),
  },
  {
    title: 'notToBe - negative case',
    assert: () => customExpect(5).notToBe(5),
    expectedError: 'Equal',
  },
];

describe('custom expect', () => {
  test.each(testCases)('$title', ({ assert, expectedError }) => {
    try {
      expect(assert()).toBe(true);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(expectedError);
      }
    }
  });
});
