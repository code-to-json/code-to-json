/* eslint-disable no-bitwise */
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as ts from 'typescript';
import { flagsToString } from '../src/flags';

@suite
class FlagsTests {
  @test
  public async flagsToStringTests() {
    expect(flagsToString(ts.ObjectFlags.Class, 'object')).to.eq('Class', 'single flag');
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

  @test public async 'type flags'() {
    expect(flagsToString(ts.TypeFlags.Intersection, 'type')).to.eql('Intersection');
  }

  @test public async 'node flags'() {
    expect(flagsToString(ts.NodeFlags.AwaitContext, 'node')).to.eql('AwaitContext');
  }

  @test public async 'nodeBuilder flags'() {
    expect(flagsToString(ts.NodeBuilderFlags.AllowEmptyTuple, 'nodeBuilder')).to.eql(
      'AllowEmptyTuple',
    );
  }

  @test public async 'symbolFormat flags'() {
    expect(
      flagsToString(ts.SymbolFormatFlags.UseAliasDefinedOutsideCurrentScope, 'symbolFormat'),
    ).to.eql('UseAliasDefinedOutsideCurrentScope');
  }

  @test public async 'invalid flag type'() {
    expect(() => flagsToString(33, 'xxx' as any)).to.throw('Unsupported flag type: xxx');
  }
}
