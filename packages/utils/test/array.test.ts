import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { all, isArray, isHomogenousArray, some } from '../src/array';

@suite
export class ArrayUtilsTests {
  @test
  public 'isArray tests'(): void {
    expect(isArray(0 as any)).to.eql(false, 'number');
    expect(isArray(null as any)).to.eql(false, 'null');
    expect(isArray(undefined as any)).to.eql(false, 'undefined');
    expect(isArray('' as any)).to.eql(false, 'string');
    expect(isArray({})).to.eql(false, 'pojo');
    expect(isArray([])).to.eql(true, 'array');
    expect(isArray(() => '')).to.eql(false, 'function');
    expect(isArray(class A {})).to.eql(false, 'class');
    expect(isArray(new class B {}() as any)).to.eql(false, 'instance');
  }

  @test
  public 'isHomogenousArray tests'(): void {
    expect(isHomogenousArray([1, '2'], v => typeof v === 'string')).to.eql(false, 'mixed contents');
    expect(isHomogenousArray([1, 2, 3], v => typeof v === 'number')).to.eql(
      true,
      'homogenous case',
    );
    expect(isHomogenousArray([], v => typeof v === 'string')).to.eql(true, 'empty case');
    expect(isHomogenousArray([[1], ['2']], isArray)).to.eql(true, 'nested array case');
  }

  @test
  public 'some tests'(): void {
    expect(some([1, '2'], v => typeof v === 'string')).to.deep.eq(true);
    expect(some([1, '2'], v => typeof v === 'function')).to.deep.eq(false);
    expect(some([1, 2], v => typeof v === 'number')).to.deep.eq(true);
  }

  @test
  public 'all tests'(): void {
    expect(all([1, '2'], v => typeof v === 'string')).to.deep.eq(false);
    expect(all([1, '2'], v => typeof v === 'function')).to.deep.eq(false);
    expect(all([1, 2], v => typeof v === 'number')).to.deep.eq(true);
    expect(all([], v => typeof v === 'number')).to.deep.eq(true);
  }
}
