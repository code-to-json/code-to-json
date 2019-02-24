import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parseCommentString } from '../src/index';

describe('JSDoc tags tests', () => {
  it('@returns tag', () => {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @returns {foo} another thing
 * bar
 *
 * third thing
 */`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      returns: {
        type: 'foo',
        tagName: 'returns',
        kind: 'param',
        content: ['another thing', '\n', 'bar', '\n', '\n', 'third thing'],
      },
    });
  });

  it('@deprecated', () => {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @deprecated
 */
`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      deprecated: [],
    });
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @deprecated until v99.0.0
 */
`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      deprecated: ['until v99.0.0'],
    });
  });

  it('@see', () => {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @see Foo
 */
`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      customTags: [
        {
          content: ['Foo'],
          kind: 'blockTag',
          tagName: 'see',
        },
      ],
    });
  });
});
