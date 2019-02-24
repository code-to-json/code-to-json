import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parseCommentString } from '../src/index';

describe('Extended tags tests', () => {
  it('modifier tags', () => {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @author Mike
 */`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      customTags: [
        {
          content: ['Mike'],
          kind: 'blockTag',
          tagName: 'author',
        },
      ],
    });
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @file foo
 */`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      customTags: [
        {
          content: ['foo'],
          kind: 'blockTag',
          tagName: 'file',
        },
      ],
    });
  });
});
