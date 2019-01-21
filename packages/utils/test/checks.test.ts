import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { isBlank, isEmpty, isNone, isPresent } from '../src/checks';

@suite('Simple predicates')
export class SimpleChecks {
  @test
  public 'isEmpty tests'(): void {
    expect(isEmpty(0)).to.eql(false);
    expect(isEmpty(null)).to.eql(true);
    expect(isEmpty([])).to.eql(true);
    expect(isEmpty({ size: 0 })).to.eql(true);
    expect(isEmpty({ size: 33 })).to.eql(false);
    expect(isEmpty({ length: 0 })).to.eql(true);
    expect(isEmpty({ length: 33 })).to.eql(false);
    expect(isEmpty(() => ({}))).to.eql(false);
    expect(isEmpty(new Map([['a', 1]]))).to.eql(false);
  }

  @test
  public 'isNone tests'(): void {
    expect(isNone(0)).to.eql(false);
    expect(isNone(null)).to.eql(true);
    expect(isNone([])).to.eql(false);
    expect(isNone({ size: 0 })).to.eql(false);
    expect(isNone({ size: 33 })).to.eql(false);
    expect(isNone({ length: 0 })).to.eql(false);
    expect(isNone({ length: 33 })).to.eql(false);
    expect(isNone(() => ({}))).to.eql(false);
    expect(isNone(new Map([['a', 1]]))).to.eql(false);
  }

  @test
  public 'isBlank tests'(): void {
    expect(isBlank(0)).to.eql(false);
    expect(isBlank(null)).to.eql(true);
    expect(isBlank([])).to.eql(true);
    expect(isBlank({ size: 0 })).to.eql(true);
    expect(isBlank({ size: 33 })).to.eql(false);
    expect(isBlank({ length: 0 })).to.eql(true);
    expect(isBlank({ length: 33 })).to.eql(false);
    expect(isBlank(() => ({}))).to.eql(false);
    expect(isBlank(new Map([['a', 1]]))).to.eql(false);
  }

  @test
  public 'isPresent tests'(): void {
    expect(isPresent(0)).to.eql(true);
    expect(isPresent(null)).to.eql(false);
    expect(isPresent([])).to.eql(false);
    expect(isPresent({ size: 0 })).to.eql(false);
    expect(isPresent({ size: 33 })).to.eql(true);
    expect(isPresent({ length: 0 })).to.eql(false);
    expect(isPresent({ length: 33 })).to.eql(true);
    expect(isPresent(() => ({}))).to.eql(true);
    expect(isPresent(new Map([['a', 1]]))).to.eql(true);
  }
}
