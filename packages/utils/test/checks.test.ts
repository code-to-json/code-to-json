import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { isDefined, isNotNull } from '../src/checks';

@suite('Simple predicates')
export class SimpleChecks {
  @test
  public 'isNotNull tests'(): void {
    expect(isNotNull(0)).to.eql(true);
    expect(isNotNull(null)).to.eql(false);
    expect(isNotNull(undefined)).to.eql(true);
    expect(isNotNull([])).to.eql(true);
    expect(isNotNull({ size: 0 })).to.eql(true);
    expect(isNotNull({ size: 33 })).to.eql(true);
    expect(isNotNull({ length: 0 })).to.eql(true);
    expect(isNotNull({ length: 33 })).to.eql(true);
    expect(isNotNull((): string => 'foo')).to.eql(true);
    expect(isNotNull(new Map([['a', 1]]))).to.eql(true);
  }

  @test
  public 'isDefined tests'(): void {
    expect(isDefined(0)).to.eql(true);
    expect(isDefined(null)).to.eql(true);
    expect(isDefined(undefined)).to.eql(false);
    expect(isDefined([])).to.eql(true);
    expect(isDefined({ size: 0 })).to.eql(true);
    expect(isDefined({ size: 33 })).to.eql(true);
    expect(isDefined({ length: 0 })).to.eql(true);
    expect(isDefined({ length: 33 })).to.eql(true);
    expect(isDefined((): string => 'foo')).to.eql(true);
    expect(isDefined(new Map([['a', 1]]))).to.eql(true);
  }
}
