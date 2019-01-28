// tslint:disable no-identical-functions
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
    expect(typeSymbol.symbolString).to.eql('x');
    expect(typeSymbol.typeString).to.eql('{ width: number; height: number; }', 'has correct type');
    expect(typeSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const typeType = t.resolveReference(typeSymbol.type);
    expect(typeType.typeString).to.eql('{ width: number; height: number; }');
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
    expect(typeSymbol.symbolString).to.eql('Dict');
    expect(typeSymbol.typeString).to.eql('Dict<T>', 'has correct type');
    expect(typeSymbol.flags).to.eql(['TypeAlias'], 'Regarded as a type alias');

    const typeType = t.resolveReference(typeSymbol.type);
    expect(typeType.typeString).to.eql('Dict<T>');
    expect(typeType.flags).to.deep.eq(['Object']);
    const [typeParam] = typeType.typeParameters!.map(tp => t.resolveReference(tp));
    expect(typeParam.typeString).to.eq('T');
    expect(!!typeParam.constraint).to.eq(false);
    const stringIndexType = t.resolveReference(typeType.stringIndexType);
    // TODO: this should really be T | undefined, although it's coming through as T
    expect(stringIndexType.typeString).to.include('T');
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
    expect(typeSymbol.symbolString).to.eql('Dict');
    expect(typeSymbol.typeString).to.eql('Dict<T>', 'has correct type');
    expect(typeSymbol.flags).to.eql(['TypeAlias'], 'Regarded as a type alias');

    const typeType = t.resolveReference(typeSymbol.type);
    expect(typeType.typeString).to.eql('Dict<T>');
    expect(typeType.flags).to.deep.eq(['Object']);
    const [typeParam] = typeType.typeParameters!.map(tp => t.resolveReference(tp));
    expect(typeParam.typeString).to.eq('T');
    expect(t.resolveReference(typeParam.constraint).typeString).to.eq('"foo" | "bar" | "baz"');
    const stringIndexType = t.resolveReference(typeType.stringIndexType);
    expect(stringIndexType.typeString).to.include('T');
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
    expect(typeSymbol.symbolString).to.eql('StringNumberOrBoolean');
    expect(typeSymbol.typeString).to.eql('StringNumberOrBoolean', 'has correct type');
    expect(typeSymbol.flags).to.eql(['TypeAlias'], 'Regarded as a type alias');

    const typeType = t.resolveReference(typeSymbol.type);
    expect(typeType.typeString).to.eql('StringNumberOrBoolean');
    expect(typeType.flags).to.deep.eq(['Union']);
    expect(!!typeType.typeParameters).to.eq(false);

    const unionParts = typeType.types!.map(typ => t.resolveReference(typ));

    expect(unionParts.length).to.eql(3);
    const [l, c, r] = unionParts;
    expect(l.typeString).to.eq('string');
    expect(c.typeString).to.eq('number');
    expect(r.typeString).to.eq('true');
    expect(l.flags).to.deep.eq(['String']);
    expect(c.flags).to.deep.eq(['Number']);
    expect(r.flags).to.deep.eq(['BooleanLiteral']);

    t.cleanup();
  }

  @test.skip
  public async 'type Split = typeof String.split'(): Promise<void> {
    const code = `export type Split = typeof String.split`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const typeSymbol = t.resolveReference(fileSymbol.exports!.Split);
    expect(typeSymbol.symbolString).to.eql('Split');
    expect(typeSymbol.typeString).to.eql('Split', 'has correct type');
    expect(typeSymbol.flags).to.eql(['TypeAlias'], 'Regarded as a type alias');

    const typeType = t.resolveReference(typeSymbol.type);
    expect(typeType.typeString).to.eql('Split');
    expect(!!typeType.typeParameters).to.eq(false);

    t.cleanup();
  }
}
