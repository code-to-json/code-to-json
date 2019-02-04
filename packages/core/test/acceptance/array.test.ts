import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class ArraySerializationTests {
  @test
  public async 'export let x: string[] = ["33"];'(): Promise<void> {
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
  }

  @test
  public async 'export let x: [string, number, number]'(): Promise<void> {
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
  }
}
