/* eslint-disable no-bitwise */
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as ts from 'typescript';
import { flagsToString } from '../src/flags';

@suite
export class FlagsTests {
  @test
  public async flagsToStringTests(): Promise<void> {
    expect(flagsToString(ts.ObjectFlags.Class, 'object')).to.deep.eq(['Class'], 'single flag');
    expect(flagsToString(ts.ObjectFlags.ClassOrInterface, 'object')).to.eql(
      ['Class', 'Interface'],
      'multiple flags',
    );
    expect(flagsToString(0, 'object')).to.eq(undefined, 'flag is zero');
    expect(flagsToString(parseInt(`${2 ** 22}`, 10), 'object')).to.eq(
      undefined,
      'flag does not exist in map',
    );
  }

  @test public async 'type flags'(): Promise<void> {
    expect(flagsToString(ts.TypeFlags.Intersection, 'type')).to.deep.equal(['Intersection']);
  }

  @test public async 'node flags'(): Promise<void> {
    expect(flagsToString(ts.NodeFlags.AwaitContext, 'node')).to.deep.equal(['AwaitContext']);
  }

  @test public async 'nodeBuilder flags'(): Promise<void> {
    expect(flagsToString(ts.NodeBuilderFlags.AllowEmptyTuple, 'nodeBuilder')).to.deep.eq([
      'AllowEmptyTuple',
    ]);
  }

  @test public async 'symbolFormat flags'(): Promise<void> {
    expect(
      flagsToString(ts.SymbolFormatFlags.UseAliasDefinedOutsideCurrentScope, 'symbolFormat'),
    ).to.deep.eq(['UseAliasDefinedOutsideCurrentScope']);
  }

  @test public async 'invalid flag type'(): Promise<void> {
    expect(() => flagsToString(33, 'xxx' as any)).to.throw('Unsupported flag type: xxx');
  }
}
