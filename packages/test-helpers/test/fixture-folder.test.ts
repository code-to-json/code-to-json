import { describe, it } from 'mocha';
import { flatten } from '../src/file-fixtures';
import { expect } from 'chai';

describe('fixture folder tests', () => {
  it('should flatten properly', () => {
    expect(
      flatten({
        'foo.txt': 'the contents of "foo"',
        'bar.txt': 'the contents of "bar"',
        bar: {
          'index.txt': 'the contents of "bar/index"',
          'baz.txt': 'the contents of "bar/baz"',
        },
      }),
    ).to.deep.eq({
      'foo.txt': 'the contents of "foo"',
      'bar.txt': 'the contents of "bar"',
      'bar/index.txt': 'the contents of "bar/index"',
      'bar/baz.txt': 'the contents of "bar/baz"',
    });
  });
});
