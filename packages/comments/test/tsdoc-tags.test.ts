import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parseCommentString } from '../src/index';

describe('TSDoc tags tests', () => {
  it('@typeparam tags', () => {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @typeparam B - Response body
 */
`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      typeParams: [
        {
          tagName: '@typeparam',
          name: 'B',
          kind: 'param',
          content: ['Response body'],
        },
      ],
    });
  });

  it('@remarks', () => {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @remarks
 *
 * This is my first line
 *
 * another line
 *
 * the last line
 *
 *
 *
 */
`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      remarks: ['This is my first line', '\n', '\n', 'another line', '\n', '\n', 'the last line'],
    });
  });

  it('modifier tags', () => {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @internal
 * @beta
 * third thing
 */`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file', '\n', '\n', '\n', '\n', 'third thing'],
      modifiers: ['internal', 'beta'],
    });
  });
});
