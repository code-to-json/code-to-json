import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class VariableAcceptanceTests {
  @test public async 'let x = "foo";'(): Promise<void> {
    const code = `export let x = "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('string');
    expect(varType.flags).to.deep.eq(['string']);
    t.cleanup();
  }

  @test public async 'const x = "foo";'(): Promise<void> {
    const code = `export const x = "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('"foo"');
    expect(varType.flags).to.deep.eq(['stringLiteral']);
    t.cleanup();
  }

  @test public async 'const x: string = "foo";'(): Promise<void> {
    const code = `export const x: string = "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('string');
    expect(varType.flags).to.deep.eq(['string']);
    t.cleanup();
  }

  @test public async 'const x: number = 42;'(): Promise<void> {
    const code = `export const x: number = 42;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('number');
    expect(varType.flags).to.deep.eq(['number']);
    t.cleanup();
  }

  @test public async 'let x: never;'(): Promise<void> {
    const code = `export let x: never;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('never');
    expect(varType.flags).to.deep.eq(['never']);
    t.cleanup();
  }

  @test public async 'const x = 42;'(): Promise<void> {
    const code = `export const x = 42;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('42');
    expect(varType.flags).to.deep.eq(['numberLiteral']);
    t.cleanup();
  }

  @test public async 'const x = () => "foo";'(): Promise<void> {
    const code = `export const x = () => "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('() => string');
    expect(varType.flags).to.deep.eq(['object']);
    expect(varType.objectFlags).to.deep.eq(['anonymous']);
    t.cleanup();
  }

  @test public async 'const x: null = null;'(): Promise<void> {
    const code = `export const x: null = null;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('null');
    expect(varType.flags).to.deep.eq(['null']);
    t.cleanup();
  }

  @test public async 'const x = null;'(): Promise<void> {
    const code = `export const x = null;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('any');
    expect(varType.flags).to.deep.eq(['any']);
    t.cleanup();
  }

  @test public async 'const x = true;'(): Promise<void> {
    const code = `export const x = true;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('true');
    expect(varType.flags).to.deep.eq(['booleanLiteral']);
    t.cleanup();
  }

  @test public async 'const x = Symbol("abc");'(): Promise<void> {
    const code = `export const x = Symbol("abc");`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('unique symbol');
    expect(varType.flags).to.deep.eq(['uniqueESSymbol']);
    t.cleanup();
  }

  @test public async 'let x = Symbol("abc");'(): Promise<void> {
    const code = `export let x = Symbol("abc");`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('symbol');
    expect(varType.flags).to.deep.eq(['eSSymbol']);
    t.cleanup();
  }

  @test public async 'const x: any = 41;'(): Promise<void> {
    const code = `export const x: any = 41;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('any');
    expect(varType.flags).to.deep.eq(['any']);
    t.cleanup();
  }

  @test public async 'const x: {foo: "bar"} = {foo: "bar" }'(): Promise<void> {
    const code = `
  interface Foo {foo: "bar"};
  export const x: Foo = {foo: "bar" }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.flags).to.deep.eq(['variable']);
    const varType = t.resolveReference(varSymbol.valueType);
    expect(varType.text).to.eq('Foo');
    expect(varType.flags).to.deep.eq(['object']);
    expect(varType.objectFlags).to.deep.eq(['interface']);
    t.cleanup();
  }
}
