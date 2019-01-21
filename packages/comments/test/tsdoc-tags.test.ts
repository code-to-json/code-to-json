import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { parseCommentString } from '../src/index';

@suite
export class TSDocTagsTests {
  @test
  public '@typeparam tags'(): void {
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
  }

  @test
  public '@remarks'(): void {
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
  }

  @test
  public 'modifier tags'(): void {
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
  }
}
