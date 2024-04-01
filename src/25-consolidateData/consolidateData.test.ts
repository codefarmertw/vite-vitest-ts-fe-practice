import { describe, expect, it } from 'vitest';
import consolidateData from './consolidateData';

const mockSessions = [
  { user: 8, duration: 50, books: ['The Hobbit'] },
  { user: 7, duration: 150, books: ['Pride and Prejudice'] },
  { user: 1, duration: 10, books: ['The Lord of the Rings'] },
  { user: 7, duration: 100, books: ['The Great Gatsby', 'Animal Farm'] },
  { user: 7, duration: 200, books: ['The Great Gatsby'] },
  { user: 2, duration: 200, books: ['1984'] },
  { user: 2, duration: 200, books: ['The Great Gatsby'] },
];

const expectedResult = [
  { user: 8, duration: 50, books: ['The Hobbit'] },
  {
    user: 7,
    duration: 450,
    books: ['Animal Farm', 'Pride and Prejudice', 'The Great Gatsby'],
  },
  { user: 1, duration: 10, books: ['The Lord of the Rings'] },
  { user: 2, duration: 400, books: ['1984', 'The Great Gatsby'] },
];

describe('consolidate sessions data', () => {
  it('should pass basic test cases', () => {
    const result = consolidateData(mockSessions);

    expect(result).toEqual(expectedResult);
    expect(result).not.toBe(mockSessions);
  });

  it('should pass edge cases', () => {
    const result = consolidateData([]);

    expect(result).toEqual([]);
  });
});
