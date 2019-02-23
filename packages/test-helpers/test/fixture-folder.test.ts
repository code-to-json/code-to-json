import { expect } from 'chai';
import { describe, it } from 'mocha';
import { flatten } from '../src/file-fixtures';
import * as path from 'path';

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
      [path.join('bar', 'index.txt')]: 'the contents of "bar/index"',
      [path.join('bar', 'baz.txt')]: 'the contents of "bar/baz"',
    });
  });
});
