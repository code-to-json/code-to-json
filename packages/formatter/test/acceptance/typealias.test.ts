import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import SingleFileAcceptanceTestCase from './helpers/test-case';

describe('TypeAlias formatting acceptance tests', () => {
  it('simple type alias', async () => {
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
      mapDict(typeType.properties!, p => t.resolveReference(t.resolveReference(p).valueType).text),
    ).to.deep.eq({
      bar: 'string',
    });
  });

  it('conditional type', async () => {
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
    expect(Bar!.flags).to.deep.eq(['typeAlias']);
    expect(x!.flags).to.deep.eq(['variable']);
    expect(y!.flags).to.deep.eq(['variable']);

    const [barType, xType, yType] = [Bar, x, y].map(s =>
      t.resolveReference(s!.valueType || s!.type),
    );

    expect(xType.text).to.eq('"foo"');
    expect(yType.text).to.eq('number[]');

    expect(barType.text).to.eq('Bar<T>');
    expect(barType.flags).to.deep.eq(['conditional']);

    expect(!!barType.conditionalInfo).to.eq(true);
    expect(t.resolveReference(barType.conditionalInfo!.checkType).text).to.eq('T');
    expect(t.resolveReference(barType.conditionalInfo!.extendsType).text).to.eq('string');
    const trueType = t.resolveReference(barType.conditionalInfo!.trueType);
    const falseType = t.resolveReference(barType.conditionalInfo!.falseType);
    expect(trueType.text).to.eq('T');
    expect(falseType.text).to.eq('number[]');
    expect(trueType.flags).to.deep.eq(['substitution']);
    expect(falseType.flags).to.deep.eq(['object']);
  });
});
