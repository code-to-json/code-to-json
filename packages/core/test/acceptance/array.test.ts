import { expect } from 'chai';
import { describe, it } from 'mocha';
import SingleFileAcceptanceTestCase from './helpers/test-case';

describe('Array serialization tests', () => {
  it('export let x: string[] = ["33"];', async () => {
    const code = 'export let x: string[] = ["33"];';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.text).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('string[]');
    expect(variableType.flags).to.deep.eq(['Object']);
    const arrayType = t.resolveReference(variableType.numberIndexType);
    expect(arrayType.text).to.eq('string');
    t.cleanup();
  });

  it('export let x: [string, number, number]', async () => {
    const src = 'export let x: [string, number, number]';
    const t = new SingleFileAcceptanceTestCase(src);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);

    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('[string, number, number]');
    expect(variableType.flags).to.deep.eq(['Object']);
    const arrayType = t.resolveReference(variableType.numberIndexType);
    expect(arrayType.text).to.eq('string | number');
    t.cleanup();
  });
});
