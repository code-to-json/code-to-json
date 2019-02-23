
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class SerializationBoundaryTests {
  @test
  public async 'array members should not be serialized - string[]'(): Promise<void> {
    const code = `export let x = ['a', 'b', 'c']`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const varSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(varSymbol.text).to.eql('x');
    expect(varSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');
    const varType = t.resolveReference(varSymbol.valueDeclarationType);

    const { allTypes, allSymbols } = t;
    const allSerializedTypeNames = Object.keys(allTypes).map((tid) => allTypes[tid]!.text);

    expect(allSerializedTypeNames).to.include.deep.members([
      'string[]',
      'string',
      'ArrayConstructor',
      'T[]',
      'T',
    ]);
    expect(allSerializedTypeNames).to.not.include.deep.members(['indexOf']);

    const allSerializedSymbolNames = Object.keys(allSymbols).map((tid) => allSymbols[tid]!.text);

    expect(allSerializedSymbolNames).to.include.deep.members([
      'x',
      'Array',
      'ArrayConstructor',
      'T',
    ]);

    expect(varType.text).to.eql('string[]');
    expect(varType.flags).to.deep.eq(['Object']);
    t.cleanup();
  }

  @test
  public async 'promise should not be serialized - explicit Promise<number>'(): Promise<void> {
    const code = `export const x: Promise<number> = Promise.resolve(4)`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const varSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(varSymbol.text).to.eql('x');
    expect(varSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const varType = t.resolveReference(varSymbol.valueDeclarationType);

    const { allTypes, allSymbols } = t;
    const allSerializedTypeNames = Object.keys(allTypes).map((tid) => allTypes[tid]!.text);

    expect(allSerializedTypeNames).to.include.deep.members(['Promise<number>', 'Promise<T>']);

    const allSerializedSymbolNames = Object.keys(allSymbols).map((tid) => allSymbols[tid]!.text);

    expect(allSerializedSymbolNames).to.include.deep.members([
      'x',
      'Promise',
      'PromiseConstructor',
    ]);

    expect(varType.text).to.eql('Promise<number>');
    expect(varType.flags).to.deep.eq(['Object']);
    t.cleanup();
  }

  @test
  public async 'promise should not be serialized - implicit Promise<number>'(): Promise<void> {
    const code = `export const x = Promise.resolve(4)`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const varSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(varSymbol.text).to.eql('x');
    expect(varSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const varType = t.resolveReference(varSymbol.valueDeclarationType);

    const { allTypes, allSymbols } = t;
    const allSerializedTypeNames = Object.keys(allTypes).map((tid) => allTypes[tid]!.text);

    expect(allSerializedTypeNames).to.contain.deep.members(['Promise<number>', 'Promise<T>']);

    const allSerializedSymbolNames = Object.keys(allSymbols).map((tid) => allSymbols[tid]!.text);

    expect(allSerializedSymbolNames).to.include.deep.members([
      'x',
      'Promise',
      'PromiseConstructor',
    ]);

    expect(varType.text).to.eql('Promise<number>');
    expect(varType.flags).to.deep.eq(['Object']);
    t.cleanup();
  }
}
