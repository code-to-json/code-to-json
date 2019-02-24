import { expect } from 'chai';
import { describe, it } from 'mocha';
import SingleFileAcceptanceTestCase from './helpers/test-case';

describe('Variable serialization tests', () => {
  it('export const x: number = 1;', async () => {
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
  });

  it('export const x = 1;', async () => {
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
  });

  it('export let x = 1;', async () => {
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
  });

  it('export let x: string | number = 33;', async () => {
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
  });

  it('export const x: Promise<number> = Promise.resolve(4);', async () => {
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
  });

  it('export const x: { p: Promise<number[]> } = { p: Promise.resolve([1, 2, 3]) };', async () => {
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
  });

  it("export const x: Pick<Promise<number>, 'then'>", async () => {
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
  });
});
