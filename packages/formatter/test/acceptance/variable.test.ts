import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import { FormattedObjectTypeKind, FormattedSymbolKind, FormattedTypeKind } from '../../src/types';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class VariableAcceptanceTests {
  @test public async 'let x = "foo";'() {
    const code = `export let x = "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('string');
    expect(varType.kind).to.eq(FormattedTypeKind.string);
    t.cleanup();
  }

  @test public async 'const x = "foo";'() {
    const code = `export const x = "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('"foo"');
    expect(varType.kind).to.eq(FormattedTypeKind.stringLiteral);
    t.cleanup();
  }

  @test public async 'const x: string = "foo";'() {
    const code = `export const x: string = "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('string');
    expect(varType.kind).to.eq(FormattedTypeKind.string);
    t.cleanup();
  }

  @test public async 'const x: number = 42;'() {
    const code = `export const x: number = 42;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('number');
    expect(varType.kind).to.eq(FormattedTypeKind.number);
    t.cleanup();
  }

  @test public async 'let x: never;'() {
    const code = `export let x: never;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('never');
    expect(varType.kind).to.eq(FormattedTypeKind.never);
    t.cleanup();
  }

  @test public async 'const x = 42;'() {
    const code = `export const x = 42;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('42');
    expect(varType.kind).to.eq(FormattedTypeKind.numberLiteral);
    t.cleanup();
  }

  @test public async 'const x = () => "foo";'() {
    const code = `export const x = () => "foo";`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('() => string');
    expect(varType.kind).to.eq(FormattedTypeKind.object);
    expect(varType.objectKind).to.eq(FormattedObjectTypeKind.anonymous);
    t.cleanup();
  }

  @test public async 'const x: null = null;'() {
    const code = `export const x: null = null;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('null');
    expect(varType.kind).to.eq(FormattedTypeKind.null);
    t.cleanup();
  }

  @test public async 'const x = null;'() {
    const code = `export const x = null;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('any');
    expect(varType.kind).to.eq(FormattedTypeKind.any);
    t.cleanup();
  }

  @test public async 'const x = true;'() {
    const code = `export const x = true;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('true');
    expect(varType.kind).to.eq(FormattedTypeKind.booleanLiteral);
    t.cleanup();
  }

  @test.skip public async 'const x = Symbol("abc");'() {
    const code = `export const x = Symbol("abc");`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('true');
    expect(varType.kind).to.eq(FormattedTypeKind.booleanLiteral);
    t.cleanup();
  }

  @test.skip public async 'let x = Symbol("abc");'() {
    const code = `export let x = Symbol("abc");`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('true');
    expect(varType.kind).to.eq(FormattedTypeKind.booleanLiteral);
    t.cleanup();
  }

  @test public async 'const x: any = 41;'() {
    const code = `export const x: any = 41;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const varSymbol = fileExports.x!;
    expect(varSymbol.text).to.eq('x');
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('any');
    expect(varType.kind).to.eq(FormattedTypeKind.any);
    t.cleanup();
  }

  @test public async 'const x: {foo: "bar"} = {foo: "bar" }'() {
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
    expect(varSymbol.kind).to.eq(FormattedSymbolKind.variable);
    const varType = t.resolveReference(varSymbol.type);
    expect(varType.text).to.eq('Foo');
    expect(varType.kind).to.eq(FormattedTypeKind.object);
    expect(varType.objectKind).to.eq(FormattedObjectTypeKind.interface);
    t.cleanup();
  }
}
