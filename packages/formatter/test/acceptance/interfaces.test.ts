import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import { FormattedObjectTypeKind, FormattedSymbolKind, FormattedTypeKind } from '../../src/types';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class InterfaceAcceptanceTests {
  @test public async 'simple interface'() {
    const code = `export interface Foo { bar: string; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.kind).to.deep.eq(FormattedSymbolKind.interface);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo');
    expect(interfaceType.kind).to.eq(FormattedTypeKind.object);
    expect(interfaceType.objectKind).to.eq(FormattedObjectTypeKind.interface);
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
  }

  @test public async 'interface w/ type param'() {
    const code = `export interface Foo<T> { bar: T; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.kind).to.deep.eq(FormattedSymbolKind.interface);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo<T>');
    expect(interfaceType.kind).to.eq(FormattedTypeKind.object);
    expect(interfaceType.objectKind).to.eq(FormattedObjectTypeKind.interface);
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
  }

  @test public async 'interface w/ constrained type param'() {
    const code = `export interface Foo<T extends number> { bar: T; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.kind).to.deep.eq(FormattedSymbolKind.interface);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo<T>');
    expect(interfaceType.kind).to.eq(FormattedTypeKind.object);
    expect(interfaceType.objectKind).to.eq(FormattedObjectTypeKind.interface);
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
  }

  @test public async 'interface w/ string index signature'() {
    const code = `export interface Foo<T> { [k: string]: T }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.kind).to.deep.eq(FormattedSymbolKind.interface);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo<T>');
    expect(interfaceType.kind).to.eq(FormattedTypeKind.object);
    expect(interfaceType.objectKind).to.eq(FormattedObjectTypeKind.interface);

    expect(t.resolveReference(interfaceType.stringIndexType).text).to.eq('T');

    expect(interfaceType.properties).to.eq(undefined);

    t.cleanup();
  }

  @test public async 'interface w/ string and number index signatures'() {
    const code = `export interface Foo<T> { [k: string]: T; [k: number]: T[]; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.kind).to.deep.eq(FormattedSymbolKind.interface);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo<T>');
    expect(interfaceType.kind).to.eq(FormattedTypeKind.object);
    expect(interfaceType.objectKind).to.eq(FormattedObjectTypeKind.interface);

    expect(t.resolveReference(interfaceType.stringIndexType).text).to.eq('T');
    expect(t.resolveReference(interfaceType.numberIndexType).text).to.eq('T[]');

    expect(interfaceType.properties).to.eq(undefined);

    t.cleanup();
  }

  @test public async 'interface w/ index signature involving union type'() {
    const code = `export interface Foo<T> { [k: string]: T | T[] }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.kind).to.deep.eq(FormattedSymbolKind.interface);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo<T>');
    expect(interfaceType.kind).to.eq(FormattedTypeKind.object);
    expect(interfaceType.objectKind).to.eq(FormattedObjectTypeKind.interface);

    const stringIndexType = t.resolveReference(interfaceType.stringIndexType);
    expect(stringIndexType.text).to.eq('T | T[]');

    expect(stringIndexType.kind).to.eq(FormattedTypeKind.union);
    const types = stringIndexType.types!;
    const [l, r] = types.map(typ => t.resolveReference(typ));
    expect(l.text).to.eq('T');
    expect(r.text).to.eq('T[]');

    expect(interfaceType.properties).to.eq(undefined);

    t.cleanup();
  }

  @test public async 'interface w/ index signature involving union and intersection types'() {
    const code = `export interface Foo<T> { [k: string]: (T | T[]) & { foo: string } }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    const { Foo: interfaceSymbol } = fileExports;
    expect(!!interfaceSymbol).to.eq(true);
    expect(interfaceSymbol!.text).to.eq('Foo');
    expect(interfaceSymbol!.kind).to.deep.eq(FormattedSymbolKind.interface);
    const interfaceType = t.resolveReference(interfaceSymbol!.type);
    expect(interfaceType.text).to.eq('Foo<T>');
    expect(interfaceType.kind).to.eq(FormattedTypeKind.object);
    expect(interfaceType.objectKind).to.eq(FormattedObjectTypeKind.interface);

    const stringIndexType = t.resolveReference(interfaceType.stringIndexType);
    expect(stringIndexType.text).to.eq('(T & { foo: string; }) | (T[] & { foo: string; })');

    expect(stringIndexType.kind).to.eq(FormattedTypeKind.union);
    const types = stringIndexType.types!;
    const [l, r] = types.map(typ => t.resolveReference(typ));
    expect(l.text).to.eq('T & { foo: string; }');
    expect(l.kind).to.eq(FormattedTypeKind.intersection);
    expect(r.text).to.eq('T[] & { foo: string; }');
    expect(r.kind).to.eq(FormattedTypeKind.intersection);

    const [ll, lr] = l.types!.map(typ => t.resolveReference(typ));
    const [rl, rr] = r.types!.map(typ => t.resolveReference(typ));

    expect(ll.text).to.eq('T');
    expect(ll.kind).to.eq('typeParameter');
    expect(lr.text).to.eq('{ foo: string; }');
    expect(lr.kind).to.eq(FormattedTypeKind.object);
    expect(lr.objectKind).to.eq(FormattedObjectTypeKind.anonymous);

    expect(rl.text).to.eq('T[]');
    expect(rl.kind).to.eq(FormattedTypeKind.object);
    expect(t.resolveReference(rl.numberIndexType!).text).to.eq('T');
    expect(rr.text).to.eq('{ foo: string; }');
    expect(rr.kind).to.eq(FormattedTypeKind.object);
    expect(rr.objectKind).to.eq(FormattedObjectTypeKind.anonymous);

    expect(interfaceType.properties).to.eq(undefined);

    t.cleanup();
  }
}
