import { expect } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
@timeout(1200)
export class InterfaceSerializationTests {
  @test
  public async 'non-exported interface'(): Promise<void> {
    const code = `interface Foo { num: number; }

    export const x: Foo = { num: 4 };`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.symbolString).to.eql('x');
    expect(variableSymbol.typeString).to.eql('Foo', 'has correct type');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('Foo');
    expect(variableType.flags).to.deep.eq(['Object']);
    expect(variableType.objectFlags).to.deep.eq(['Interface']);
    const typePropertyNames = Object.keys(variableType.properties!);
    expect(typePropertyNames).to.deep.eq(['num']);
    const firstProp = t.resolveReference(variableType.properties!.num);
    expect(firstProp.name).to.eql('num');
    expect(firstProp.typeString).to.eql('number');
    t.cleanup();
  }

  @test
  public async 'interface Foo {bar: number; readonly baz: Promise<string>}'(): Promise<void> {
    const code = `export interface Foo {bar: number; readonly baz: Promise<string>}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.Foo);
    expect(variableSymbol.symbolString).to.eql('Foo');
    expect(variableSymbol.typeString).to.eql('Foo', 'has correct type');
    expect(variableSymbol.flags).to.eql(['Interface'], 'Regarded as an interface');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('Foo');
    expect(variableType.flags).to.deep.eq(['Object']);
    expect(variableType.objectFlags).to.deep.eq(['Interface']);
    const typePropertyNames = Object.keys(variableType.properties!);
    expect(typePropertyNames).to.deep.eq(['bar', 'baz']);
    const [bar, baz] = Object.keys(variableType.properties!).map(pName =>
      t.resolveReference(variableType.properties![pName]),
    );
    expect(bar.name).to.eql('bar');
    expect(bar.typeString).to.eql('number');
    expect(bar.modifiers).to.deep.eq(undefined);
    expect(baz.name).to.eql('baz');
    expect(baz.typeString).to.eql('Promise<string>');
    expect(baz.modifiers).to.deep.eq(['readonly']);
    t.cleanup();
  }
}
