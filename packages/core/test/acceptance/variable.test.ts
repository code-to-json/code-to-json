import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class VariableSerializationTests {
  @test
  public async 'export const x: number = 1;'(): Promise<void> {
    const code = 'export const x: number = 1;';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    expect(fileSymbol.exports).to.be.an('object', "file symbol's exports is an object");
    expect(Object.keys(fileSymbol.exports!)).to.deep.eq(['x']);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.symbolString).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');
    expect(variableSymbol.modifiers).to.eql(undefined, 'No modifiers');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('number');
    expect(variableType.flags).to.deep.eq(['Number']);
    t.cleanup();
  }

  @test
  public async 'export const x = 1;'(): Promise<void> {
    const code = 'export const x = 1;';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.symbolString).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');
    expect(variableSymbol.modifiers).to.eql(undefined, 'No modifiers');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('1');
    expect(variableType.flags).to.deep.eq(['NumberLiteral']);
    t.cleanup();
  }

  @test
  public async 'export let x = 1;'(): Promise<void> {
    const code = 'export let x = 1;';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.symbolString).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('number');
    expect(variableType.flags).to.deep.eq(['Number']);
    t.cleanup();
  }

  @test
  public async 'export let x: string | number = 33;'(): Promise<void> {
    const code = 'export let x: string | number = 33;';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.symbolString).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('string | number');
    expect(variableType.flags).to.deep.eq(['Union']);
    t.cleanup();
  }

  @test
  public async 'export const x: Promise<number> = Promise.resolve(4);'(): Promise<void> {
    const code = 'export const x: Promise<number> = Promise.resolve(4);';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.symbolString).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('Promise<number>');
    expect(variableType.flags).to.deep.eq(['Object']);
    expect(variableType.libName).to.eq('lib.es5.d.ts');
    expect(variableType.objectFlags).to.deep.eq(['Reference']);
    t.cleanup();
  }

  @test
  public async 'export const x: { p: Promise<number[]> } = { p: Promise.resolve([1, 2, 3]) };'(): Promise<
    void
  > {
    const code = 'export const x: { p: Promise<number[]> } = { p: Promise.resolve([1, 2, 3]) };';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.symbolString).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('{ p: Promise<number[]>; }');
    expect(variableType.flags).to.deep.eq(['Object']);
    expect(variableType.objectFlags).to.deep.eq(['Anonymous']);
    expect(Object.keys(variableType.properties!)).to.deep.eq(['p']);
    const pSym = t.resolveReference(variableType.properties!.p);
    expect(pSym.symbolString).to.eq('p');
    const pTyp = t.resolveReference(pSym.type);
    expect(pTyp.typeString).to.eq('Promise<number[]>');
    expect(pTyp.libName).to.eq('lib.es5.d.ts');
    t.cleanup();
  }

  @test
  public async "export const x: Pick<Promise<number>, 'then'>"(): Promise<void> {
    const code = "export const x: Pick<Promise<number>, 'then'>";
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.symbolString).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('Pick<Promise<number>, "then">');
    expect(variableType.flags).to.deep.eq(['Object']);
    expect(variableType.objectFlags).to.deep.eq(['Mapped', 'Instantiated']);
    expect(variableType.typeParameters).to.have.lengthOf(1);
    expect(variableType.constraint).to.have.lengthOf(2);
    const constraint = t.resolveReference(variableType.constraint);
    expect(constraint.typeString).to.eq('"then"');
    const [typeParam] = variableType.typeParameters!.map(tp => t.resolveReference(tp));
    expect(typeParam.typeString).to.eql('P');
    const modType = t.resolveReference(variableType.modifiersType);
    expect(modType.typeString).to.eq('Promise<number>');
    t.cleanup();
  }
}
