import { SerializedSymbol, WalkerOutputData } from '@code-to-json/core';
import { createRef } from '@code-to-json/utils';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FormatterRefRegistry } from '../../src';
import { create as createDataCollector } from '../../src/data-collector';
import formatSymbol from '../../src/symbol';

@suite.skip
export class SymbolFormatterTests {
  @test
  public async basic() {
    const sym: SerializedSymbol = {
      id: '1234',
      name: 'foo',
      entity: 'symbol',
      flags: [],
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
    expect(
      formatSymbol(
        wo,
        sym,
        createRef<FormatterRefRegistry, 's'>('s', '1234'),
        createDataCollector(),
      ),
    ).to.deep.eq({ id: '1234', name: 'foo' });
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
    expect(
      formatSymbol(
        wo,
        sym,
        createRef<FormatterRefRegistry, 's'>('s', '1234'),
        createDataCollector(),
      ),
    ).to.deep.eq({ id: '1234', name: 'foo', flags: ['interface'] });
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
      flags: ['module'],
    };
    const wo: WalkerOutputData = {
      symbols: {
        '1234': sym,
        '3456': {
          id: '3456',
          name: 'somethingExported',
          entity: 'symbol',
          flags: ['variable'],
        },
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {},
    };
    expect(
      formatSymbol(
        wo,
        sym,
        createRef<FormatterRefRegistry, 's'>('s', '1234'),
        createDataCollector(),
      ),
    ).to.deep.eq({ id: '1234', name: 'foo', exports: { somethingExported: ['s', '3456'] } });
  }

  @test
  public async 'with empty exports'() {
    const sym: SerializedSymbol = {
      id: '1234',
      name: 'foo',
      entity: 'symbol',
      exports: {},
      flags: ['module'],
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
    expect(
      formatSymbol(
        wo,
        sym,
        createRef<FormatterRefRegistry, 's'>('s', '1234'),
        createDataCollector(),
      ),
    ).to.deep.eq({ id: '1234', name: 'foo' });
  }

  @test
  public async 'with members'() {
    const sym: SerializedSymbol = {
      id: '1234',
      members: {
        someMember: ['symbol', '3456'] as any,
      },
      flags: ['interface'],
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
          flags: ['variable'],
        },
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {},
    };
    expect(
      formatSymbol(
        wo,
        sym,
        createRef<FormatterRefRegistry, 's'>('s', '1234'),
        createDataCollector(),
      ),
    ).to.deep.eq({ id: '1234', name: 'foo', members: { someMember: ['s', '3456'] } });
  }

  @test
  public async 'with bad member reference'() {
    const sym: SerializedSymbol = {
      id: '1234',
      members: {
        someMember: ['symbol', '3'] as any,
      },
      flags: [],
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
    expect(
      formatSymbol(
        wo,
        sym,
        createRef<FormatterRefRegistry, 's'>('s', '1234'),
        createDataCollector(),
      ),
    ).to.deep.include({ id: '1234', name: 'foo' });
  }

  @test
  public async 'with empty members'() {
    const sym: SerializedSymbol = {
      id: '1234',
      name: 'foo',
      entity: 'symbol',
      flags: [],
      members: {},
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
    expect(
      formatSymbol(
        wo,
        sym,
        createRef<FormatterRefRegistry, 's'>('s', '1234'),
        createDataCollector(),
      ),
    ).to.deep.eq({ id: '1234', name: 'foo' });
  }

  @test
  public async 'with bad export reference'() {
    const sym: SerializedSymbol = {
      id: '1234',
      exports: {
        foo: ['symbol', '3'] as any,
      },
      name: 'foo',
      flags: [],
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
    expect(
      formatSymbol(
        wo,
        sym,
        createRef<FormatterRefRegistry, 's'>('s', '1234'),
        createDataCollector(),
      ),
    ).to.deep.include({
      id: '1234',
      name: 'foo',
    });
  }
}
