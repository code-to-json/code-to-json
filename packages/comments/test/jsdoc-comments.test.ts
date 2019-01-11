// tslint:disable no-duplicate-string

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { parseCommentString } from '../src/index';

@suite
class JSDocCommentsTests {
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

  @test
  public '@param tags (TS style)'(): void {
    expect(
      parseCommentString(`
/**
 * Add two numbers together
 *
 *
 * @param x first number
 * @param y second number
 */`),
    ).to.deep.eq(
      {
        summary: ['Add two numbers together'],
        params: [
          { tagName: '@param', name: 'x', content: ['first number'] },
          {
            tagName: '@param',
            name: 'y',
            content: ['second number'],
          },
        ],
      },
      'single-line comment',
    );
  }

  @test
  public '@param tags (JS style) (1)'(): void {
    expect(
      parseCommentString(`
/**
 * Add two numbers together
 *
 *
 * @param x {string} first number
 */`),
    ).to.deep.eq(
      {
        summary: ['Add two numbers together'],
        params: [
          {
            tagName: '@param',
            name: 'x',
            type: 'string',
            content: ['first number'],
          },
        ],
      },
      'single-line comment',
    );
  }

  @test
  public '@param tags (JS style) (2)'(): void {
    expect(
      parseCommentString(`
/**
 * Add two numbers together
 *
 *
 * @param x {string} first number
 * @param y {string} second number
 */`),
    ).to.deep.eq(
      {
        summary: ['Add two numbers together'],
        params: [
          {
            tagName: '@param',
            name: 'x',
            type: 'string',
            content: ['first number'],
          },
          {
            tagName: '@param',
            name: 'y',
            type: 'string',
            content: ['second number'],
          },
        ],
      },
      'single-line comment',
    );
  }

  @test
  public '@param tags (TSDoc style)'(): void {
    expect(
      parseCommentString(`
  /**
   * Add two numbers together
   *
   *
   * @param x - first number
   * @param y - second number
   */`),
    ).to.deep.eq(
      {
        summary: ['Add two numbers together'],
        params: [
          {
            tagName: '@param',
            name: 'x',
            content: ['first number'],
          },
          {
            tagName: '@param',
            name: 'y',
            content: ['second number'],
          },
        ],
      },
      'single-line comment',
    );
  }

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
        content: ['another thing', '\n', 'bar', '\n', '\n', 'third thing'],
      },
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
  public '{@link url}'(): void {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 * {@link https://emberjs.com}
 */
`),
    ).to.deep.eq({
      summary: [
        'This is only a comment in a file',
        '\n',
        {
          tagName: '@link',
          content: [],
          url: 'https://emberjs.com',
        },
      ],
    });
  }

  @test
  public '{@link url | text}'(): void {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 * {@link https://emberjs.com | The Ember Project}
 */
`),
    ).to.deep.eq({
      summary: [
        'This is only a comment in a file',
        '\n',
        {
          tagName: '@link',
          content: ['The Ember Project'],
          url: 'https://emberjs.com',
        },
      ],
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
}
