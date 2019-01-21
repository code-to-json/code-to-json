import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { parseCommentString } from '../src/index';

@suite
export class JSDocTagsTests {
  @test
  public '@returns tag'(): void {
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
  }

  @test
  public '@deprecated'(): void {
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
  }

  @test
  public '@see'(): void {
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
  }
}
