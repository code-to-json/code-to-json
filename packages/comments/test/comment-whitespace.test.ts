import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { parseCommentString } from '../src/index';

@suite
export class CommentWhitespaceTests {
  @test
  public 'simple comment with no tags'(): void {
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
  }
}
