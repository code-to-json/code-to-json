import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import SingleFileAcceptanceTestCase from './helpers/test-case';

describe('Variable formatting acceptance tests', () => {
  it('let x = "foo";', async () => {
    const code = `export let x = "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('string');
    expect(varType.flags).to.deep.eq(['string']);
    t.cleanup();
  });

  it('const x = "foo";', async () => {
    const code = `export const x = "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('"foo"');
    expect(varType.flags).to.deep.eq(['stringLiteral']);
    t.cleanup();
  });

  it('const x: string = "foo";', async () => {
    const code = `export const x: string = "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('string');
    expect(varType.flags).to.deep.eq(['string']);
    t.cleanup();
  });

  it('const x: number = 42;', async () => {
    const code = `export const x: number = 42;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('number');
    expect(varType.flags).to.deep.eq(['number']);
    t.cleanup();
  });

  it('let x: never;', async () => {
    const code = `export let x: never;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('never');
    expect(varType.flags).to.deep.eq(['never']);
    t.cleanup();
  });

  it('const x = 42;', async () => {
    const code = `export const x = 42;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('42');
    expect(varType.flags).to.deep.eq(['numberLiteral']);
    t.cleanup();
  });

  it('const x = () => "foo";', async () => {
    const code = `export const x = () => "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('() => string');
    expect(varType.flags).to.deep.eq(['object']);
    expect(varType.objectFlags).to.deep.eq(['anonymous']);
    t.cleanup();
  });

  it('const x: null = null;', async () => {
    const code = `export const x: null = null;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('null');
    expect(varType.flags).to.deep.eq(['null']);
    t.cleanup();
  });

  it('const x = null;', async () => {
    const code = `export const x = null;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('any');
    expect(varType.flags).to.deep.eq(['any']);
    t.cleanup();
  });

  it('const x = true;', async () => {
    const code = `export const x = true;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('true');
    expect(varType.flags).to.deep.eq(['booleanLiteral']);
    t.cleanup();
  });

  it('const x = Symbol("abc");', async () => {
    const code = `export const x = Symbol("abc");`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('unique symbol');
    expect(varType.flags).to.deep.eq(['uniqueESSymbol']);
    t.cleanup();
  });

  it('let x = Symbol("abc");', async () => {
    const code = `export let x = Symbol("abc");`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('symbol');
    expect(varType.flags).to.deep.eq(['eSSymbol']);
    t.cleanup();
  });

  it('const x: any = 41;', async () => {
    const code = `export const x: any = 41;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('any');
    expect(varType.flags).to.deep.eq(['any']);
    t.cleanup();
  });

  it('const x: {foo: "bar"} = {foo: "bar" }', async () => {
    const code = `
  interface Foo {foo: "bar"};
  export const x: Foo = {foo: "bar" }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('Foo');
    expect(varType.flags).to.deep.eq(['object']);
    expect(varType.objectFlags).to.deep.eq(['interface']);
    t.cleanup();
  });
});
