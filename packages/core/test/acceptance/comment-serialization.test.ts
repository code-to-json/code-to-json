// tslint:disable no-identical-functions

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { exportedModuleSymbols } from './helpers';

@suite
export class CustomTypeSerialiationBoundaryTests {
  @test
  public async 'basic comments'(): Promise<void> {
    const { exports, cleanup } = await exportedModuleSymbols(`interface Foo { num: number; }

/**
 * A thing
 */
export const x: Foo = { num: 4 };`);
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Object'],
          objectFlags: ['Interface'],
          typeString: 'Foo',
        },
        documentation: {
          summary: ['A thing'],
        },
      },
    });
    cleanup();
  }

  @test
  public async 'with @see block tag'(): Promise<void> {
    const { exports, cleanup } = await exportedModuleSymbols(`interface Foo { num: number; }

/**
 * A thing
 * @see Mike
 */
export const x: Foo = { num: 4 };`);
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Object'],
          objectFlags: ['Interface'],
          typeString: 'Foo',
        },
        documentation: {
          customTags: [
            {
              content: ['Mike'],
              kind: 'blockTag',
              tagName: 'see',
            },
          ],
          summary: ['A thing'],
        },
      },
    });
    cleanup();
  }

  @test
  public async 'with @param tags'(): Promise<void> {
    const {
      exports: allExports,
      cleanup,
    } = await exportedModuleSymbols(`interface Foo { num: number; }

/**
 * Add two numbers
 * @param a first number
 * @param b second number
 */
export function add(a: number, b: number) { return a + b; }`);
    const { add } = allExports;
    expect(add).to.deep.eq({
      name: 'add',
      type: {
        flags: ['Object'],
        objectFlags: ['Anonymous'],
        typeString: '(a: number, b: number) => number',
      },
      documentation: {
        params: [
          {
            content: ['first number'],
            kind: 'param',
            name: 'a',
            tagName: 'param',
          },
          {
            content: ['second number'],
            kind: 'param',
            name: 'b',
            tagName: 'param',
          },
        ],
        summary: ['Add two numbers'],
      },
    });
    cleanup();
  }

  @test
  public async 'with an @example tag and fenced code example'(): Promise<void> {
    const {
      exports: allExports,
      cleanup,
    } = await exportedModuleSymbols(`interface Foo { num: number; }

/**
 * Add two numbers
 *
 * @example
 * \`\`\`ts
 * const x = add(4, 6); // 10
 * \`\`\`
 */
export function add(a: number, b: number) { return a + b; }`);
    const { add } = allExports;
    expect(add).to.deep.eq({
      name: 'add',
      type: {
        flags: ['Object'],
        objectFlags: ['Anonymous'],
        typeString: '(a: number, b: number) => number',
      },
      documentation: {
        customTags: [
          {
            content: [
              {
                code: 'const x = add(4, 6); // 10\n',
                kind: 'fencedCode',
                language: 'ts',
              },
            ],
            kind: 'blockTag',
            tagName: 'example',
          },
        ],
        summary: ['Add two numbers'],
      },
    });
    cleanup();
  }

  @test
  public async 'with inline code'(): Promise<void> {
    const {
      exports: allExports,
      cleanup,
    } = await exportedModuleSymbols(`interface Foo { num: number; }

/**
 * Add two numbers
 *
 * \`const x = add(4, 6); // 10\`
 */
export function add(a: number, b: number) { return a + b; }`);
    const { add } = allExports;
    expect(add).to.deep.eq({
      name: 'add',
      type: {
        flags: ['Object'],
        objectFlags: ['Anonymous'],
        typeString: '(a: number, b: number) => number',
      },
      documentation: {
        summary: [
          'Add two numbers',
          '\n',
          '\n',
          {
            code: 'const x = add(4, 6); // 10',
            kind: 'inlineCode',
          },
        ],
      },
    });
    cleanup();
  }

  @test
  public async 'with HTML tags'(): Promise<void> {
    const {
      exports: allExports,
      cleanup,
    } = await exportedModuleSymbols(`interface Foo { num: number; }

/**
 * Add two numbers
 *
 * <a data-name="foo" href="https://example.com">Example.com</a>
 *
 * And a picture
 *
 * <img src="https://example.com/foo.gif" />
 */
export function add(a: number, b: number) { return a + b; }`);
    const { add } = allExports;
    expect(add).to.deep.eq({
      name: 'add',
      type: {
        flags: ['Object'],
        objectFlags: ['Anonymous'],
        typeString: '(a: number, b: number) => number',
      },
      documentation: {
        summary: [
          'Add two numbers',
          '\n',
          '\n',
          {
            attributes: [
              {
                name: 'data-name',
                value: '"foo"',
              },
              {
                name: 'href',
                value: '"https://example.com"',
              },
            ],
            isSelfClosingTag: false,
            kind: 'htmlStartTag',
            name: 'a',
          },
          'Example.com',
          {
            kind: 'htmlEndTag',
            name: 'a',
          },
          '\n',
          '\n',
          'And a picture',
          '\n',
          '\n',
          {
            attributes: [
              {
                name: 'src',
                value: '"https://example.com/foo.gif"',
              },
            ],
            isSelfClosingTag: true,
            kind: 'htmlStartTag',
            name: 'img',
          },
        ],
      },
    });
    cleanup();
  }
}
