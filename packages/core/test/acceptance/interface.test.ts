import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
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
    expect(variableSymbol.text).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('Foo');
    expect(variableType.flags).to.deep.eq(['Object']);
    expect(variableType.objectFlags).to.deep.eq(['Interface']);
    const typePropertyNames = Object.keys(variableType.properties!);
    expect(typePropertyNames).to.deep.eq(['num']);
    const firstProp = t.resolveReference(variableType.properties!.num);
    expect(firstProp.name).to.eql('num');
    const firstPropType = t.resolveReference(firstProp.valueDeclarationType);
    expect(firstPropType.text).to.eql('number');
    t.cleanup();
  }

  @test
  public async 'interface Foo {bar: number; readonly baz: Promise<string>}'(): Promise<void> {
    const code = `export interface Foo {bar: number; readonly baz: Promise<string>}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const interfaceSymbol = t.resolveReference(fileSymbol.exports!.Foo);
    expect(interfaceSymbol.text).to.eql('Foo');
    expect(interfaceSymbol.flags).to.eql(['Interface'], 'Regarded as an interface');

    const interfaceType = t.resolveReference(interfaceSymbol.symbolType);
    expect(interfaceType.text).to.eql('Foo', 'has correct type');
    expect(interfaceType.text).to.eql('Foo');
    expect(interfaceType.flags).to.deep.eq(['Object']);
    expect(interfaceType.objectFlags).to.deep.eq(['Interface']);
    const typePropertyNames = Object.keys(interfaceType.properties!);
    expect(typePropertyNames).to.deep.eq(['bar', 'baz']);
    const [bar, baz] = Object.keys(interfaceType.properties!).map((pName) =>
      t.resolveReference(interfaceType.properties![pName]),
    );
    const [barType, bazType] = [bar, baz].map((s) => t.resolveReference(s.valueDeclarationType));
    expect(bar.name).to.eql('bar');
    expect(barType.text).to.eql('number');
    expect(bar.modifiers).to.deep.eq(undefined);
    expect(baz.name).to.eql('baz');
    expect(bazType.text).to.eql('Promise<string>');
    expect(baz.modifiers).to.deep.eq(['readonly']);
    t.cleanup();
  }
}
