import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import SingleFileAcceptanceTestCase from './helpers/test-case';

describe('Interface formatting acceptance tests', () => {
  it('simple interface', async () => {
    const code = `export interface Foo { bar: string; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.flags).to.deep.eq(['interface']);

    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo');
    expect(interfaceType.flags).to.deep.eq(['object']);
    expect(interfaceType.objectFlags).to.deep.eq(['interface']);
    expect(interfaceType.typeParameters).to.eq(undefined);

    const interfacePropertySymbols = mapDict(interfaceType.properties!, p => t.resolveReference(p));
    const interfacePropertyTypes = mapDict(interfacePropertySymbols, ps =>
      t.resolveReference(ps.valueType),
    );

    expect(Object.keys(interfacePropertySymbols)).to.deep.eq(['bar']);
    expect(Object.keys(interfacePropertyTypes)).to.deep.eq(['bar']);

    expect(mapDict(interfacePropertyTypes, typ => typ.text)).to.deep.eq({
      bar: 'string',
    });

    t.cleanup();
  });

  it('interface w/ type param', async () => {
    const code = `export interface Foo<T> { bar: T; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.flags).to.deep.eq(['interface']);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo<T>');
    expect(interfaceType.flags).to.deep.eq(['object']);
    expect(interfaceType.objectFlags).to.deep.eq(['interface', 'reference']);
    expect(interfaceType.typeParameters!.length).to.eq(1);

    const [firstTypeParam] = interfaceType.typeParameters!.map(tp => t.resolveReference(tp));
    expect(firstTypeParam.text).to.eq('T');
    expect(firstTypeParam.constraint).to.eq(undefined);

    const interfacePropertySymbols = mapDict(interfaceType.properties!, p => t.resolveReference(p));
    const interfacePropertyTypes = mapDict(interfacePropertySymbols, ps =>
      t.resolveReference(ps.valueType),
    );

    expect(Object.keys(interfacePropertySymbols)).to.deep.eq(['bar']);
    expect(Object.keys(interfacePropertyTypes)).to.deep.eq(['bar']);

    expect(mapDict(interfacePropertyTypes, typ => typ.text)).to.deep.eq({
      bar: 'T',
    });

    t.cleanup();
  });

  it('interface w/ constrained type param', async () => {
    const code = `export interface Foo<T extends number> { bar: T; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.flags).to.deep.eq(['interface']);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo<T>');
    expect(interfaceType.flags).to.deep.eq(['object']);
    expect(interfaceType.objectFlags).to.deep.eq(['interface', 'reference']);
    expect(interfaceType.typeParameters!.length).to.eq(1);

    const [firstTypeParam] = interfaceType.typeParameters!.map(tp => t.resolveReference(tp));
    expect(firstTypeParam.text).to.eq('T');
    expect(t.resolveReference(firstTypeParam.constraint).text).to.eq('number');

    const interfacePropertySymbols = mapDict(interfaceType.properties!, p => t.resolveReference(p));
    const interfacePropertyTypes = mapDict(interfacePropertySymbols, ps =>
      t.resolveReference(ps.valueType),
    );

    expect(Object.keys(interfacePropertySymbols)).to.deep.eq(['bar']);
    expect(Object.keys(interfacePropertyTypes)).to.deep.eq(['bar']);

    expect(mapDict(interfacePropertyTypes, typ => typ.text)).to.deep.eq({
      bar: 'T',
    });

    t.cleanup();
  });

  it('interface w/ string index signature', async () => {
    const code = `export interface Foo<T> { [k: string]: T }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.flags).to.deep.eq(['interface']);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo<T>');
    expect(interfaceType.flags).to.deep.eq(['object']);
    expect(interfaceType.objectFlags).to.deep.eq(['interface', 'reference']);

    expect(t.resolveReference(interfaceType.stringIndexType).text).to.eq('T');

    expect(interfaceType.properties).to.eq(undefined);

    t.cleanup();
  });

  it('interface w/ string and number index signatures', async () => {
    const code = `export interface Foo<T> { [k: string]: T; [k: number]: T[]; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.flags).to.deep.eq(['interface']);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo<T>');
    expect(interfaceType.flags).to.deep.eq(['object']);
    expect(interfaceType.objectFlags).to.deep.eq(['interface', 'reference']);

    expect(t.resolveReference(interfaceType.stringIndexType).text).to.eq('T');
    expect(t.resolveReference(interfaceType.numberIndexType).text).to.eq('T[]');

    expect(interfaceType.properties).to.eq(undefined);

    t.cleanup();
  });

  it('interface w/ index signature involving union type', async () => {
    const code = `export interface Foo<T> { [k: string]: T | T[] }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.flags).to.deep.eq(['interface']);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.deep.eq('Foo<T>');
    expect(interfaceType.flags).to.deep.eq(['object']);
    expect(interfaceType.objectFlags).to.deep.eq(['interface', 'reference']);

    const stringIndexType = t.resolveReference(interfaceType.stringIndexType);
    expect(stringIndexType.text).to.eq('T | T[]');

    expect(stringIndexType.flags).to.deep.eq(['union']);
    const types = stringIndexType.types!;
    const [l, r] = types.map(typ => t.resolveReference(typ));
    expect(l.text).to.eq('T');
    expect(r.text).to.eq('T[]');

    expect(interfaceType.properties).to.eq(undefined);

    t.cleanup();
  });

  it('interface w/ index signature involving union and intersection types', async () => {
    const code = `export interface Foo<T> { [k: string]: (T | T[]) & { foo: string } }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.flags).to.deep.eq(['interface']);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo<T>');
    expect(interfaceType.flags).to.deep.eq(['object']);
    expect(interfaceType.objectFlags).to.deep.eq(['interface', 'reference']);

    const stringIndexType = t.resolveReference(interfaceType.stringIndexType);
    expect(stringIndexType.text).to.eq('(T & { foo: string; }) | (T[] & { foo: string; })');

    expect(stringIndexType.flags).to.deep.eq(['union']);
    const types = stringIndexType.types!;
    const [l, r] = types.map(typ => t.resolveReference(typ));
    expect(l.text).to.eq('T & { foo: string; }');
    expect(l.flags).to.deep.eq(['intersection']);
    expect(r.text).to.eq('T[] & { foo: string; }');
    expect(r.flags).to.deep.eq(['intersection']);

    const [ll, lr] = l.types!.map(typ => t.resolveReference(typ));
    const [rl, rr] = r.types!.map(typ => t.resolveReference(typ));

    expect(ll.text).to.eq('T');
    expect(ll.flags).to.deep.eq(['typeParameter']);
    expect(lr.text).to.eq('{ foo: string; }');
    expect(lr.flags).to.deep.eq(['object']);
    expect(lr.objectFlags).to.deep.eq(['anonymous']);

    expect(rl.text).to.eq('T[]');
    expect(rl.flags).to.deep.eq(['object']);
    expect(t.resolveReference(rl.numberIndexType!).text).to.eq('T');
    expect(rr.text).to.eq('{ foo: string; }');
    expect(rr.flags).to.deep.eq(['object']);
    expect(rr.objectFlags).to.deep.eq(['anonymous']);

    expect(interfaceType.properties).to.eq(undefined);

    t.cleanup();
  });
});
