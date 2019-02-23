import { isDefined } from '@code-to-json/utils';
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class SignatureSerializationTests {
  @test
  public async 'function with one signature'(): Promise<void> {
    const code = `export function add(a: number, b: number) { return a + b; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const fnSymbol = t.resolveReference(fileSymbol.exports!.add);
    expect(fnSymbol.text).to.eql('add');
    expect(fnSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    const fnType = t.resolveReference(fnSymbol.valueDeclarationType);
    expect(fnType.text).to.eq('(a: number, b: number) => number');

    expect(fnType.callSignatures!.length).to.eq(1);
    expect(fnType.callSignatures![0].text).to.eq('(a: number, b: number): number');
    expect(
      fnType
        .callSignatures![0].parameters!.map(p => t.resolveReference(p))
        .filter(isDefined)
        .map(s => ({
          name: s.text || s.name,
          type: t.resolveReference(s.valueDeclarationType).text,
        })),
    ).to.deep.eq([
      {
        name: 'a',
        type: 'number',
      },
      {
        name: 'b',
        type: 'number',
      },
    ]);
    t.cleanup();
  }

  @test
  public async 'param and return types via JSDoc comment'(): Promise<void> {
    const code = `/**
 * @param a {string} first thing
 * @param b {string} second thing
 * @returns {string} concatenated strings
 */
export function add(a, b) { return a + b; }`;
    const t = new SingleFileAcceptanceTestCase(code, 'js');
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const fnSymbol = t.resolveReference(fileSymbol.exports!.add);
    expect(fnSymbol.text).to.eql('add');
    expect(fnSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    const fnType = t.resolveReference(fnSymbol.valueDeclarationType);
    expect(fnType.text).to.eq('(a: string, b: string) => string');

    expect(fnType.callSignatures!.length).to.eq(1);
    expect(fnType.callSignatures![0].text).to.eq('(a: string, b: string): string');
    expect(
      fnType
        .callSignatures![0].parameters!.map(p => t.resolveReference(p))
        .filter(isDefined)
        .map(s => ({
          name: s.text || s.name,
          type: t.resolveReference(s.valueDeclarationType).text,
        })),
    ).to.deep.eq([
      {
        name: 'a',
        type: 'string',
      },
      {
        name: 'b',
        type: 'string',
      },
    ]);
    t.cleanup();
  }

  @test
  public async 'function with multiple signatures'(): Promise<void> {
    const code = `export function add(a: string, b: string): string;
export function add(a: number, b: number): number;
export function add(a: number | string, b: number | string): number | string {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a + b;
  } else {
    throw new Error('unreachable');
  }
}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const fnSymbol = t.resolveReference(fileSymbol.exports!.add);
    expect(fnSymbol.text).to.eql('add');
    expect(fnSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    const fnType = t.resolveReference(fnSymbol.valueDeclarationType);
    expect(fnType.text).to.eq(
      '{ (a: string, b: string): string; (a: number, b: number): number; }',
    );

    expect(fnType.callSignatures!.length).to.eq(2);
    expect(fnType.callSignatures![0].text).to.eq('(a: string, b: string): string');
    expect(
      fnType
        .callSignatures![0].parameters!.map(p => t.resolveReference(p))
        .filter(isDefined)
        .map(s => ({
          name: s.text || s.name,
          type: t.resolveReference(s.valueDeclarationType).text,
        })),
    ).to.deep.eq([
      {
        name: 'a',
        type: 'string',
      },
      {
        name: 'b',
        type: 'string',
      },
    ]);
    expect(fnType.callSignatures![1].text).to.eq('(a: number, b: number): number');
    expect(
      fnType
        .callSignatures![1].parameters!.map(p => t.resolveReference(p))
        .filter(isDefined)
        .map(s => ({
          name: s.text || s.name,
          type: t.resolveReference(s.valueDeclarationType).text,
        })),
    ).to.deep.eq([
      {
        name: 'a',
        type: 'number',
      },
      {
        name: 'b',
        type: 'number',
      },
    ]);

    t.cleanup();
  }

  @test
  public async 'function with multiple signatures, sharing documentation'(): Promise<void> {
    const code = `
/**
 * Add a couple of things together
 * @param a first
 * @param b second
 *
 * @author Mike
 */
export function add(a: string, b: string): string;
export function add(a: number, b: number): number;
export function add(a: number | string, b: number | string): number | string {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a + b;
  } else {
    throw new Error('unreachable');
  }
}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const fnSymbol = t.resolveReference(fileSymbol.exports!.add);
    expect(fnSymbol.text).to.eql('add');
    expect(fnSymbol.flags).to.eql(['Function'], 'Regarded as a function');
    expect(fnSymbol.documentation).to.deep.eq({
      customTags: [
        {
          content: ['Mike'],
          kind: 'blockTag',
          tagName: 'author',
        },
      ],
      params: [
        {
          content: ['first'],
          kind: 'param',
          name: 'a',
          tagName: 'param',
        },
        {
          content: ['second'],
          kind: 'param',
          name: 'b',
          tagName: 'param',
        },
      ],
      summary: ['Add a couple of things together'],
    });

    const fnType = t.resolveReference(fnSymbol.valueDeclarationType);
    expect(fnType.text).to.eq(
      '{ (a: string, b: string): string; (a: number, b: number): number; }',
    );

    expect(fnType.callSignatures!.length).to.eq(2);
    expect(fnType.callSignatures![0].text).to.eq('(a: string, b: string): string');
    expect(fnType.callSignatures![0].documentation).to.deep.eq({
      customTags: [
        {
          content: ['Mike'],
          kind: 'blockTag',
          tagName: 'author',
        },
      ],
      params: [
        {
          content: ['first'],
          kind: 'param',
          name: 'a',
          tagName: 'param',
        },
        {
          content: ['second'],
          kind: 'param',
          name: 'b',
          tagName: 'param',
        },
      ],
      summary: ['Add a couple of things together'],
    });
    expect(fnType.callSignatures![1].documentation).to.eq(undefined);
    t.cleanup();
  }

  @test
  public async 'function with multiple signatures, with a doc override for several signatures'(): Promise<
    void
  > {
    const code = `
/**
 * Add a couple of strings together
 * @param a first string
 * @param b second string
 *
 * @author Mike
 */
export function add(a: string, b: string): string;
/**
 * Add a couple of numbers together
 * @param a first number
 * @param b second number
 *
 * @author Mike
 */
export function add(a: number, b: number): number;
export function add(a: number | string, b: number | string): number | string {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a + b;
  } else {
    throw new Error('unreachable');
  }
}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const fnSymbol = t.resolveReference(fileSymbol.exports!.add);
    expect(fnSymbol.text).to.eql('add');
    expect(fnSymbol.flags).to.eql(['Function'], 'Regarded as a function');
    expect(fnSymbol.documentation).to.deep.eq({
      customTags: [
        {
          content: ['Mike'],
          kind: 'blockTag',
          tagName: 'author',
        },
      ],
      params: [
        {
          content: ['first string'],
          kind: 'param',
          name: 'a',
          tagName: 'param',
        },
        {
          content: ['second string'],
          kind: 'param',
          name: 'b',
          tagName: 'param',
        },
      ],
      summary: ['Add a couple of strings together'],
    });

    const fnType = t.resolveReference(fnSymbol.valueDeclarationType);
    expect(fnType.text).to.eq(
      '{ (a: string, b: string): string; (a: number, b: number): number; }',
    );

    expect(fnType.callSignatures!.length).to.eq(2);
    expect(fnType.callSignatures![0].text).to.eq('(a: string, b: string): string');
    expect(fnType.callSignatures![0].documentation).to.deep.eq({
      customTags: [
        {
          content: ['Mike'],
          kind: 'blockTag',
          tagName: 'author',
        },
      ],
      params: [
        {
          content: ['first string'],
          kind: 'param',
          name: 'a',
          tagName: 'param',
        },
        {
          content: ['second string'],
          kind: 'param',
          name: 'b',
          tagName: 'param',
        },
      ],
      summary: ['Add a couple of strings together'],
    });
    expect(fnType.callSignatures![1].documentation).to.deep.eq({
      customTags: [
        {
          content: ['Mike'],
          kind: 'blockTag',
          tagName: 'author',
        },
      ],
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
      summary: ['Add a couple of numbers together'],
    });
    t.cleanup();
  }
}
