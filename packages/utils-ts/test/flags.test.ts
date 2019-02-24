/* eslint-disable no-bitwise */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as ts from 'typescript';
import { flagsToString } from '../src/flags';

describe('Flags tests', () => {
  it('flagsToStringTests', async () => {
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
  });

  it('type flags', async () => {
    expect(flagsToString(ts.TypeFlags.Intersection, 'type')).to.deep.equal(['Intersection']);
  });

  it('node flags', async () => {
    expect(flagsToString(ts.NodeFlags.AwaitContext, 'node')).to.deep.equal(['AwaitContext']);
  });

  it('nodeBuilder flags', async () => {
    expect(flagsToString(ts.NodeBuilderFlags.AllowEmptyTuple, 'nodeBuilder')).to.deep.eq([
      'AllowEmptyTuple',
    ]);
  });

  it('symbolFormat flags', async () => {
    expect(
      flagsToString(ts.SymbolFormatFlags.UseAliasDefinedOutsideCurrentScope, 'symbolFormat'),
    ).to.deep.eq(['UseAliasDefinedOutsideCurrentScope']);
  });

  it('invalid flag type', async () => {
    expect(() => flagsToString(33, 'xxx' as any)).to.throw('Unsupported flag type: xxx');
  });
});
