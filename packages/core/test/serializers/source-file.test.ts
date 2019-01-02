import { createRef } from '@code-to-json/utils';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as ts from 'typescript';
import { SymbolRef } from '../../src';
import generateId from '../../src/processing-queue/generate-id';
import serializeSourceFile from '../../src/serializers/source-file';
import serializeSymbol from '../../src/serializers/symbol';
import { setupScenario } from './helpers';

@suite
class SourceFileSerializtionTests {
  @test
  public async 'single-function, no exports'(): Promise<void> {
    const { checker, sf, q } = setupScenario(
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

    const sfRef = createRef('sourceFile', generateId(sf));
    const serialized = serializeSourceFile(sf, checker, sfRef, q);
    expect(serialized).to.deep.eq({
      entity: 'sourceFile',
      fileName: 'module.ts',
      id: 'module.ts',
      isDeclarationFile: false,
    });
  }

  @test
  public async 'single exported function'(): Promise<void> {
    const { checker, sf, q } = setupScenario(
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

    const sfRef = createRef('sourceFile', generateId(sf));
    const serialized = serializeSourceFile(sf, checker, sfRef, q);
    expect(serialized).to.deep.eq({
      entity: 'sourceFile',
      fileName: 'module.ts',
      id: 'module.ts',
      isDeclarationFile: false,
      symbol: ['symbol', '01m4wml8nqp3'],
    });

    const { symbol: symbols } = q.drain({
      handleSymbol(_ref: SymbolRef, sym: ts.Symbol) {
        return sym;
      },
    });
    const { '01m4wml8nqp3': fileSymbol } = symbols;
    const serializedFileSymbol = serializeSymbol(
      fileSymbol,
      checker,
      createRef('symbol', generateId(fileSymbol)),
      q,
    );

    expect(serializedFileSymbol).to.deep.include({
      entity: 'symbol',
      flags: 'ValueModule',
      id: '01m4wml8nqp3',
      exports: [['symbol', '01m4wm69lbfm']],
      location: ['module.ts', 1, 1, 1, 67],
      name: '"module"',
      sourceFile: ['sourceFile', 'module.ts'],
    });
    expect(serializedFileSymbol)
      .to.haveOwnProperty('type')
      .instanceOf(Array)
      .lengthOf(2);
  }
}
