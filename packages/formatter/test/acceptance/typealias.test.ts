import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import { FormattedSymbolKind, FormattedTypeKind } from '../../src/types';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class TypeAliasAcceptanceTests {
  @test public async 'simple type alias'() {
    const code = 'export type Foo = { bar: string }';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const typeSymbol = t.resolveReference(fileSymbol.exports!.Foo);
    expect(typeSymbol.name).to.eql('Foo');
    const typeType = t.resolveReference(typeSymbol.type);
    expect(typeType.text).to.eq('Foo');
    expect(
      mapDict(typeType.properties!, p => t.resolveReference(t.resolveReference(p).type).text),
    ).to.deep.eq({
      bar: 'string',
    });
  }

  @test public async 'conditional type'() {
    const code = `export type Bar<T> = T extends string ? T : number[];
    export const x: Bar<'foo'> = 'foo';
    export const y: Bar<Promise<string>> = [1, 2, 3];`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const fileExports = mapDict(fileSymbol.exports!, exp => t.resolveReference(exp));
    expect(Object.keys(fileExports)).to.deep.eq(['Bar', 'x', 'y']);
    const { Bar, x, y } = fileExports;
    expect(Bar!.kind).to.eq(FormattedSymbolKind.typeAlias);
    expect(x!.kind).to.eq(FormattedSymbolKind.variable);
    expect(y!.kind).to.eq(FormattedSymbolKind.variable);

    const [barType, xType, yType] = [Bar, x, y].map(s => t.resolveReference(s!.type));

    expect(xType.text).to.eq('"foo"');
    expect(yType.text).to.eq('number[]');

    expect(barType.text).to.eq('Bar<T>');
    expect(barType.kind).to.eq(FormattedTypeKind.conditional);

    expect(!!barType.conditionalInfo).to.eq(true);
    expect(t.resolveReference(barType.conditionalInfo!.checkType).text).to.eq('T');
    expect(t.resolveReference(barType.conditionalInfo!.extendsType).text).to.eq('string');
    const trueType = t.resolveReference(barType.conditionalInfo!.trueType);
    const falseType = t.resolveReference(barType.conditionalInfo!.falseType);
    expect(trueType.text).to.eq('T');
    expect(falseType.text).to.eq('number[]');
    expect(trueType.kind).to.eq(FormattedTypeKind.substitution);
    expect(falseType.kind).to.eq(FormattedTypeKind.object);
  }
}
