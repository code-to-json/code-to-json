import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parseCommentString } from '../src/index';

describe('JSDoc code block tests', () => {
  it('fenced code', () => {
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
  });
  it('@example tag', () => {
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
  });
  it('@doctest tag', () => {
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
  });

  it('fenced code block in a docsection', () => {
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
  });
});
