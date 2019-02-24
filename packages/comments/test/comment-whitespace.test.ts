import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parseCommentString } from '../src/index';

describe('Comment whitespace formatting tests', () => {
  it('simple comment with no tags', () => {
    expect(parseCommentString('/** hello world */')).to.deep.eq(
      {
        summary: ['hello world'],
      },
      'single-line comment',
    );
    expect(
      parseCommentString(`/**
    hello world
    this is a second line
    */`),
    ).to.deep.eq(
      {
        summary: ['hello world', '\n', 'this is a second line'],
      },
      'multi-line comment',
    );

    expect(
      parseCommentString(`
/**
 * hello world
 *
 * this is a second line
 */`),
    ).to.deep.eq(
      {
        summary: ['hello world', '\n', '\n', 'this is a second line'],
      },
      'multi-line comment with blank lines',
    );
  });
});
