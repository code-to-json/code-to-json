import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import SingleFileAcceptanceTestCase from './helpers/test-case';

describe('Function acceptance tests', () => {
  it('simple function declaration', async () => {
    const code = `export function add(a: number, b: number) { return a + b; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const fnSymbol = fileExports.add!;
    expect(fnSymbol.text).to.eq('add');
    expect(!!fnSymbol.isAsync).to.eq(false);
    const fnType = t.resolveReference(fnSymbol.valueType);
    expect(fnType.text).to.eq('(a: number, b: number) => number');
    expect(!!fnType.callSignatures).to.eq(true);
    expect(fnType.callSignatures!.length).to.eq(1);
    expect(fnType.callSignatures![0].parameters!.length).to.eq(2);
    const [a, b] = fnType.callSignatures![0].parameters!;
    const [atype, btype] = [a, b].map(x => t.resolveReference(x.type));
    expect(atype.text).to.eq('number');
    expect(btype.text).to.eq('number');
  });

  it('simple async function declaration', async () => {
    const code = `export async function add(a: number, b: number) { return a + b; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const fnSymbol = fileExports.add!;
    expect(fnSymbol.text).to.eq('add');
    expect(fnSymbol.isAsync).to.eq(true);
    const fnType = t.resolveReference(fnSymbol.valueType);
    expect(fnType.text).to.eq('(a: number, b: number) => Promise<number>');
    expect(!!fnType.callSignatures).to.eq(true);
    expect(fnType.callSignatures!.length).to.eq(1);
    expect(fnType.callSignatures![0].parameters!.length).to.eq(2);
    const [a, b] = fnType.callSignatures![0].parameters!;
    const [atype, btype] = [a, b].map(x => t.resolveReference(x.type));
    expect(atype.text).to.eq('number');
    expect(btype.text).to.eq('number');
  });

  it('overloaded function declaration', async () => {
    const code = `
    export function add(a: number, b: number): number;
    export function add(a: string, b: string): string;
    export function add(a: number | string, b: number | string): number | string { return a + b; }
    `;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const fnSymbol = fileExports.add!;
    expect(fnSymbol.text).to.eq('add');
    expect(!!fnSymbol.isAsync).to.eq(false);
    const fnType = t.resolveReference(fnSymbol.valueType);
    expect(fnType.text).to.eq(
      '{ (a: number, b: number): number; (a: string, b: string): string; }',
    );
    expect(!!fnType.callSignatures).to.eq(true);
    expect(fnType.callSignatures!.length).to.eq(2);
    expect(fnType.callSignatures![0].parameters!.length).to.eq(2);
    expect(fnType.callSignatures![0].hasRestParameter).to.eq(false);
    expect(fnType.callSignatures![1].parameters!.length).to.eq(2);
    expect(fnType.callSignatures![1].hasRestParameter).to.eq(false);
    expect(fnType.callSignatures![1].text).to.eq('(a: string, b: string): string');

    const [a, b] = fnType.callSignatures![0].parameters!;
    const [atype, btype] = [a, b].map(x => t.resolveReference(x.type));
    expect(atype.text).to.eq('number');
    expect(btype.text).to.eq('number');

    const [c, d] = fnType.callSignatures![1].parameters!;
    const [ctype, dtype] = [c, d].map(x => t.resolveReference(x.type));
    expect(ctype.text).to.eq('string');
    expect(dtype.text).to.eq('string');
  });

  it('function w/ rest param', async () => {
    const code = `export function x(...args: string[]) { return args.join(', '); }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const fnSymbol = fileExports.x!;
    expect(fnSymbol.text).to.eq('x');
    expect(!!fnSymbol.isAsync).to.eq(false);
    const fnType = t.resolveReference(fnSymbol.valueType);
    expect(fnType.text).to.eq('(...args: string[]) => string');
    expect(!!fnType.callSignatures).to.eq(true);
    expect(fnType.callSignatures!.length).to.eq(1);
    expect(fnType.callSignatures![0].parameters!.length).to.eq(1);
    expect(fnType.callSignatures![0].hasRestParameter).to.eq(true);
    const [a] = fnType.callSignatures![0].parameters!;
    const [atype] = [a].map(x => t.resolveReference(x.type));
    expect(atype.text).to.eq('string[]');
  });
});
