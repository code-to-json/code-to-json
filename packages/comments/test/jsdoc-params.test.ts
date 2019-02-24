import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parseCommentString } from '../src/index';

describe('JSDoc params tests', () => {
  it('@param tags (TS style)', () => {
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
          { tagName: 'param', name: 'x', content: ['first number'], kind: 'param' },
          {
            tagName: 'param',
            kind: 'param',
            name: 'y',
            content: ['second number'],
          },
        ],
      },
      'single-line comment',
    );
  });

  it('@param tags (JS style) (1)', () => {
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
            tagName: 'param',
            kind: 'param',
            name: 'x',
            type: 'string',
            content: ['first number'],
          },
        ],
      },
      'single-line comment',
    );
  });

  it('@param tags (JS style) (2)', () => {
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
            kind: 'param',
            tagName: 'param',
            name: 'x',
            type: 'string',
            content: ['first number'],
          },
          {
            kind: 'param',
            tagName: 'param',
            name: 'y',
            type: 'string',
            content: ['second number'],
          },
        ],
      },
      'single-line comment',
    );
  });
});
