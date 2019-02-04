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
    expect(variableSymbol.text).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable']);
    expect(variableSymbol.modifiers).to.eql(undefined, 'No modifiers');

    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('number');
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
    expect(variableSymbol.text).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable']);
    expect(variableSymbol.modifiers).to.eql(undefined, 'No modifiers');

    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('1');
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
    expect(variableSymbol.text).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable']);

    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('number');
    expect(variableType.flags).to.deep.eq(['Number']);
    t.cleanup();
  }

  @test
  public async 'export let x: string | number = 33;'(): Promise<void> {
    const src = 'export let x: string | number = 33;';
    const t = new SingleFileAcceptanceTestCase(src);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.text).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable']);

    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('string | number');
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
    expect(variableSymbol.text).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable']);

    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('Promise<number>');
    expect(variableType.flags).to.deep.eq(['Object']);
    expect(variableType.libName).to.eq('lib.es2015.promise.d.ts');
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
    expect(variableSymbol.text).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable']);

    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('{ p: Promise<number[]>; }');
    expect(variableType.flags).to.deep.eq(['Object']);
    expect(variableType.objectFlags).to.deep.eq(['Anonymous']);

    expect(Object.keys(variableType.properties!)).to.deep.eq(['p']);

    const pSym = t.resolveReference(variableType.properties!.p);
    expect(pSym.text).to.eq('p');

    const pTyp = t.resolveReference(pSym.valueDeclarationType);
    expect(pTyp.text).to.eq('Promise<number[]>');
    expect(pTyp.libName).to.eq('lib.es2015.promise.d.ts');
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
    expect(variableSymbol.text).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable']);

    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('Pick<Promise<number>, "then">');
    expect(variableType.flags).to.deep.eq(['Object']);
    expect(variableType.objectFlags).to.deep.eq(['Mapped', 'Instantiated']);

    t.cleanup();
  }
}
