import { createRef } from '@code-to-json/utils';
import { generateId } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as ts from 'typescript';
import { RefRegistry, SymbolRef } from '../../src';
import serializeSourceFile from '../../src/serializers/source-file';
import serializeSymbol from '../../src/serializers/symbol';
import { setupScenario } from './helpers';

@suite
class SourceFileSerializtionTests {
  @test
  public async 'single-function, no exports'(): Promise<void> {
    const { checker, sf, collector } = setupScenario(
      `function add(a: number, b: number): number { return a + b; }
const x = add(4, 5);
console.log(x);`,
    );
    const [fnSym] = checker.getSymbolsInScope(sf, ts.SymbolFlags.Function);
    if (!fnSym) {
      throw new Error('Function has no symbol');
    }
    const [fnDecl] = fnSym.declarations;
    expect(fnDecl.getText()).to.eql('function add(a: number, b: number): number { return a + b; }');

    const sfRef = createRef<RefRegistry, 'sourceFile'>('sourceFile', generateId(sf));
    const serialized = serializeSourceFile(sf, checker, sfRef, collector);
    expect(serialized).to.deep.eq({
      entity: 'sourceFile',
      extension: 'ts',
      moduleName: 'module',
      pathInPackage: 'module',
      originalFileName: 'module.ts',
      id: '01m4wlwidurl',
      isDeclarationFile: false,
    });
  }

  @test
  public async 'single exported function'(): Promise<void> {
    const { checker, sf, collector } = setupScenario(
      `export function add(a: number, b: number): number { return a + b; }`,
    );
    const [fnSym] = checker.getSymbolsInScope(sf, ts.SymbolFlags.Function);
    if (!fnSym) {
      throw new Error('Function has no symbol');
    }
    const [fnDecl] = fnSym.declarations;
    expect(fnDecl.getText()).to.eql(
      'export function add(a: number, b: number): number { return a + b; }',
    );

    const sfRef = createRef<RefRegistry, 'sourceFile'>('sourceFile', generateId(sf));
    const serialized = serializeSourceFile(sf, checker, sfRef, collector);
    expect(serialized).to.deep.eq({
      entity: 'sourceFile',
      extension: 'ts',
      id: '01m4wlwidurl',
      isDeclarationFile: false,
      moduleName: 'module',
      originalFileName: 'module.ts',
      pathInPackage: 'module',
      symbol: ['symbol', '01m4wlshjs98'],
    });

    const { symbols } = collector.queue.process({
      mapSymbol(_ref: SymbolRef, sym: ts.Symbol) {
        return sym;
      },
    });
    const { '01m4wlshjs98': fileSymbol } = symbols;
    const serializedFileSymbol = serializeSymbol(
      fileSymbol,
      checker,
      createRef<RefRegistry, 'symbol'>('symbol', generateId(fileSymbol)),
      collector,
    );

    expect(serializedFileSymbol).to.deep.include({
      entity: 'symbol',
      flags: ['ValueModule'],
      id: '01m4wlshjs98',
      exports: [['symbol', '01m4wm55tsjg']],
      location: [['sourceFile', '01m4wlwidurl'], 1, 1, 1, 67],
      name: '"module"',
      sourceFile: ['sourceFile', '01m4wlwidurl'],
    });
    expect(serializedFileSymbol)
      .to.haveOwnProperty('type')
      .instanceOf(Array)
      .lengthOf(2);
  }
}
