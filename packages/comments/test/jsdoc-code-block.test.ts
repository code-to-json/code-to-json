import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { parseCommentString } from '../src/index';

@suite
export class JSDocCodeBlockTests {
  @test
  public 'fenced code'(): void {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * \`\`\`ts
 * function foo() {}
 * \`\`\`
 */
`),
    ).to.deep.eq({
      summary: [
        'This is only a comment in a file',
        '\n',
        '\n',
        {
          code: 'function foo() {}\n',
          kind: 'fencedCode',
          language: 'ts',
        },
      ],
    });
  }
  @test
  public '@example tag'(): void {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @example
 *
 * function foo() {}
 * foo(); // equal: undefined
 *
 */
`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      customTags: [
        {
          content: ['function foo() {} ', '\n', 'foo(); // equal: undefined'],
          kind: 'blockTag',
          tagName: 'example',
        },
      ],
    });
  }
  @test
  public '@doctest tag'(): void {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @doctest
 *
 * function foo() {}
 * foo(); // equal: undefined
 *
 */
`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      customTags: [
        {
          content: ['function foo() {} ', '\n', 'foo(); // equal: undefined'],
          kind: 'blockTag',
          tagName: 'doctest',
        },
      ],
    });
  }

  @test
  public 'fenced code block in a docsection'(): void {
    expect(
      parseCommentString(`/**
 * Concatenate two strings
 *
 *\`\`\`ts
 * foo('foo', 'bar');
 *\`\`\`
 *
 * @public
 */`),
    ).to.deep.eq({
      modifiers: ['public'],
      summary: [
        'Concatenate two strings',
        '\n',
        '\n',
        {
          code: "foo('foo', 'bar');\n",
          kind: 'fencedCode',
          language: 'ts',
        },
      ],
    });
  }
}
