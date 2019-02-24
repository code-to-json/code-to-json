import { expect } from 'chai';
import { describe, it } from 'mocha';
import { all, isArray, isHomogenousArray, some } from '../src/array';

describe('Array utilities tests', () => {
  it('isArray tests', () => {
    expect(isArray(0 as any)).to.eql(false, 'number');
    expect(isArray(null as any)).to.eql(false, 'null');
    expect(isArray(undefined as any)).to.eql(false, 'undefined');
    expect(isArray('' as any)).to.eql(false, 'string');
    expect(isArray({})).to.eql(false, 'pojo');
    expect(isArray([])).to.eql(true, 'array');
    expect(isArray(() => '')).to.eql(false, 'function');
    expect(isArray(class A {})).to.eql(false, 'class');
    expect(isArray(new class B {}() as any)).to.eql(false, 'instance');
  });

  it('isHomogenousArray tests', () => {
    expect(isHomogenousArray([1, '2'], v => typeof v === 'string')).to.eql(false, 'mixed contents');
    expect(isHomogenousArray([1, 2, 3], v => typeof v === 'number')).to.eql(
      true,
      'homogenous case',
    );
    expect(isHomogenousArray([], v => typeof v === 'string')).to.eql(true, 'empty case');
    expect(isHomogenousArray([[1], ['2']], isArray)).to.eql(true, 'nested array case');
  });

  it('some tests', () => {
    expect(some([1, '2'], v => typeof v === 'string')).to.deep.eq(true);
    expect(some([1, '2'], v => typeof v === 'function')).to.deep.eq(false);
    expect(some([1, 2], v => typeof v === 'number')).to.deep.eq(true);
  });

  it('all tests', () => {
    expect(all([1, '2'], v => typeof v === 'string')).to.deep.eq(false);
    expect(all([1, '2'], v => typeof v === 'function')).to.deep.eq(false);
    expect(all([1, 2], v => typeof v === 'number')).to.deep.eq(true);
    expect(all([], v => typeof v === 'number')).to.deep.eq(true);
  });
});
