import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { parseCommentString } from '../src/index';

@suite
export class LinkTagsTests {
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
          kind: 'linkTag',
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
          kind: 'linkTag',
          tagName: '@link',
          content: ['The Ember Project'],
          url: 'https://emberjs.com',
        },
      ],
    });
  }
}
