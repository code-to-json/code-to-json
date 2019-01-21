import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { parseCommentString } from '../src/index';

@suite
export class JSDocParamsTests {
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
  }
}
