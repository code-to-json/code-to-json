
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class TypeSerializationTests {
  @test
  public async 'type queries'(): Promise<void> {
    const code = `let rectangle1 = { width: 100, height: 200 };
    export let x: typeof rectangle1;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const typeSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(typeSymbol.text).to.eql('x');
    expect(typeSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const typeType = t.resolveReference(typeSymbol.valueDeclarationType);
    expect(typeType.text).to.eql('{ width: number; height: number; }');
    expect(typeType.flags).to.deep.eq(['Object']);
    t.cleanup();
  }

  @test
  public async 'type Dict<T> = { [k: string]: T | undefined }'(): Promise<void> {
    const code = `export type Dict<T> = { [k: string]: T | undefined }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const typeSymbol = t.resolveReference(fileSymbol.exports!.Dict);
    expect(typeSymbol.text).to.eql('Dict');
    expect(typeSymbol.flags).to.deep.eq(['TypeAlias'], 'Regarded as a type alias');

    const typeType = t.resolveReference(typeSymbol.symbolType);
    expect(typeType.text).to.eql('Dict<T>', 'has correct type');
    expect(typeType.flags).to.deep.eq(['Object']);
    const [typeParam] = typeType.typeParameters!.map(tp => t.resolveReference(tp));
    expect(typeParam.text).to.eq('T');
    expect(!!typeParam.constraint).to.eq(false);
    const stringIndexType = t.resolveReference(typeType.stringIndexType);
    // TODO: this should really be T | undefined, although it's coming through as T
    expect(stringIndexType.text).to.include('T');
    t.cleanup();
  }
  @test
  public async 'with comments'(): Promise<void> {
    const code = `/**
 * A dictionary
 */
export type Dict<T> = { [k: string]: T | undefined }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const typeSymbol = t.resolveReference(fileSymbol.exports!.Dict);
    expect(typeSymbol.text).to.eql('Dict');
    expect(typeSymbol.flags).to.eql(['TypeAlias'], 'Regarded as a type alias');
    expect(typeSymbol.documentation).to.deep.eq({ summary: ['A dictionary'] }, 'Documentation');

    t.cleanup();
  }

  @test
  public async 'type Dict<T extends "foo"|"bar"|"baz"> = { [k: string]: T }'(): Promise<void> {
    const code = `export type Dict<T extends "foo"|"bar"|"baz"> = { [k: string]: T }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const typeSymbol = t.resolveReference(fileSymbol.exports!.Dict);
    expect(typeSymbol.text).to.eql('Dict');
    expect(typeSymbol.flags).to.eql(['TypeAlias'], 'Regarded as a type alias');

    const typeType = t.resolveReference(typeSymbol.symbolType);
    expect(typeType.text).to.eql('Dict<T>');
    expect(typeType.flags).to.deep.eq(['Object']);
    const [typeParam] = typeType.typeParameters!.map(tp => t.resolveReference(tp));
    expect(typeParam.text).to.eq('T');
    expect(t.resolveReference(typeParam.constraint).text).to.eq('"foo" | "bar" | "baz"');
    const stringIndexType = t.resolveReference(typeType.stringIndexType);
    expect(stringIndexType.text).to.include('T');
    t.cleanup();
  }

  @test
  public async 'type StringNumberOrBoolean = string | number | true'(): Promise<void> {
    const code = `export type StringNumberOrBoolean = string | number | true`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const typeSymbol = t.resolveReference(fileSymbol.exports!.StringNumberOrBoolean);
    expect(typeSymbol.text).to.eql('StringNumberOrBoolean');
    expect(typeSymbol.flags).to.eql(['TypeAlias'], 'Regarded as a type alias');

    const typeType = t.resolveReference(typeSymbol.symbolType);
    expect(typeType.text).to.eql('StringNumberOrBoolean');
    expect(typeType.flags).to.deep.eq(['Union']);
    expect(!!typeType.typeParameters).to.eq(false);

    const unionParts = typeType.types!.map(typ => t.resolveReference(typ));

    expect(unionParts.length).to.eql(3);
    const [l, c, r] = unionParts;
    expect(l.text).to.eq('string');
    expect(c.text).to.eq('number');
    expect(r.text).to.eq('true');
    expect(l.flags).to.deep.eq(['String']);
    expect(c.flags).to.deep.eq(['Number']);
    expect(r.flags).to.deep.eq(['BooleanLiteral']);

    t.cleanup();
  }

  @test
  public async 'type Split = typeof String.prototype.split'(): Promise<void> {
    const code = `export type Split = typeof String.prototype.split`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const typeSymbol = t.resolveReference(fileSymbol.exports!.Split);
    expect(typeSymbol.text).to.eql('Split');
    expect(typeSymbol.flags).to.eql(['TypeAlias'], 'Regarded as a type alias');

    const typeType = t.resolveReference(typeSymbol.symbolType);
    expect(typeType.text).to.eql(
      '{ (separator: string | RegExp, limit?: number): string[]; (splitter: { [Symbol.split](string: string, limit?: number): string[]; }, limit?: number): string[]; }',
    );
    expect(!!typeType.typeParameters).to.eq(false);

    t.cleanup();
  }
}
