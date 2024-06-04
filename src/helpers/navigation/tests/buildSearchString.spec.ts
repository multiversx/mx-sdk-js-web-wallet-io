import { buildSearchString } from '../buildSearchString';

describe('buildSearchString', () => {
  it('should correctly build search strings from plain transactions', () => {
    const input = [
      { id: 1, value: '100', type: 'deposit' },
      { id: 2, value: '200', type: 'withdrawal' },
      { id: 3, value: '150', type: 'deposit' }
    ];

    const expectedOutput = {
      id: [1, 2, 3],
      value: ['100', '200', '150'],
      type: ['deposit', 'withdrawal', 'deposit']
    };

    expect(buildSearchString(input)).toEqual(expectedOutput);
  });

  it('should handle empty input array', () => {
    const input: Record<string, string | number>[] = [];

    const expectedOutput = {};

    expect(buildSearchString(input)).toEqual(expectedOutput);
  });

  it('should handle transactions with different keys', () => {
    const input: Record<string, string | number>[] = [
      { id: 1, value: '100' },
      { type: 'withdrawal', amount: '200' },
      { id: 3, type: 'deposit' }
    ];

    const expectedOutput = {
      id: [1, undefined, 3],
      value: ['100', undefined, undefined],
      type: [undefined, 'withdrawal', 'deposit'],
      amount: [undefined, '200', undefined]
    };

    expect(buildSearchString(input)).toEqual(expectedOutput);
  });
});
