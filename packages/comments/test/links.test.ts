import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parseCommentString } from '../src/index';

describe('JSDoc link tag tests', () => {
  it('{@link url}', () => {
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
  });

  it('{@link url | text}', () => {
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
  });
});
