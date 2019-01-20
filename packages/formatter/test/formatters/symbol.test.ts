import { SerializedSymbol, WalkerOutputData } from '@code-to-json/core';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { create as createDataCollector } from '../../src/data-collector';
import formatSymbol from '../../src/symbol';

@suite
class SymbolFormatterTests {
  @test
  public async basic() {
    const sym: SerializedSymbol = {
      id: '1234',
      name: 'foo',
      entity: 'symbol',
    };
    const wo: WalkerOutputData = {
      symbols: {
        '1234': sym,
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {},
    };
    expect(formatSymbol(wo, sym, createDataCollector())).to.deep.eq({
      name: 'foo',
    });
  }

  @test
  public async 'with flags'() {
    const sym: SerializedSymbol = {
      id: '1234',
      flags: ['Interface'],
      name: 'foo',
      entity: 'symbol',
    };
    const wo: WalkerOutputData = {
      symbols: {
        '1234': sym,
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {},
    };
    expect(formatSymbol(wo, sym, createDataCollector())).to.deep.eq({
      name: 'foo',
      flags: ['interface'],
    });
  }

  @test
  public async 'with exports'() {
    const sym: SerializedSymbol = {
      id: '1234',
      exports: {
        somethingExported: ['symbol', '3456'] as any,
      },
      name: 'foo',
      entity: 'symbol',
    };
    const wo: WalkerOutputData = {
      symbols: {
        '1234': sym,
        '3456': {
          id: '3456',
          name: 'somethingExported',
          entity: 'symbol',
        },
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {},
    };
    expect(formatSymbol(wo, sym, createDataCollector())).to.deep.eq({
      name: 'foo',
      exports: { somethingExported: ['s', '3456'] },
    });
  }

  @test
  public async 'with empty exports'() {
    const sym: SerializedSymbol = {
      id: '1234',
      name: 'foo',
      entity: 'symbol',
    };
    const wo: WalkerOutputData = {
      symbols: {
        '1234': sym,
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {},
    };
    expect(formatSymbol(wo, sym, createDataCollector())).to.deep.eq({
      name: 'foo',
    });
  }

  @test
  public async 'with members'() {
    const sym: SerializedSymbol = {
      id: '1234',
      members: {
        someMember: ['symbol', '3456'] as any,
      },
      name: 'foo',
      entity: 'symbol',
    };
    const wo: WalkerOutputData = {
      symbols: {
        '1234': sym,
        '3456': {
          id: '3456',
          name: 'someMember',
          entity: 'symbol',
        },
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {},
    };
    expect(formatSymbol(wo, sym, createDataCollector())).to.deep.eq({
      name: 'foo',
      members: { someMember: ['s', '3456'] },
    });
  }

  @test
  public async 'with bad member reference'() {
    const sym: SerializedSymbol = {
      id: '1234',
      // members: [['symbol', '3'] as any],
      name: 'foo',
      entity: 'symbol',
    };
    const wo: WalkerOutputData = {
      symbols: {
        '1234': sym,
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {},
    };
    expect(formatSymbol(wo, sym, createDataCollector())).to.deep.eq({
      name: 'foo',
    });
  }

  @test
  public async 'with empty members'() {
    const sym: SerializedSymbol = {
      id: '1234',
      name: 'foo',
      entity: 'symbol',
    };
    const wo: WalkerOutputData = {
      symbols: {
        '1234': sym,
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {},
    };
    expect(formatSymbol(wo, sym, createDataCollector())).to.deep.eq({
      name: 'foo',
    });
  }

  @test
  public async 'with bad export reference'() {
    const sym: SerializedSymbol = {
      id: '1234',
      // exports: [['symbol', '3'] as any],
      name: 'foo',
      entity: 'symbol',
    };
    const wo: WalkerOutputData = {
      symbols: {
        '1234': sym,
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {},
    };
    expect(formatSymbol(wo, sym, createDataCollector())).to.deep.eq({
      name: 'foo',
    });
  }

  @test
  public async 'with call and constructor signatures'() {
    const sym: SerializedSymbol = {
      id: '1234',
      name: 'foo',
      entity: 'symbol',
    };
    const wo: WalkerOutputData = {
      symbols: {
        '1234': sym,
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {},
    };
    expect(formatSymbol(wo, sym, createDataCollector())).to.deep.eq({
      name: 'foo',
    });
  }
}
