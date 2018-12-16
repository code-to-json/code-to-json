import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { createRef } from '../src/deferred-processing/ref';
import { isRef, Ref } from '../src/index';

@suite
class DeferredProcessingTests {
  @test
  public 'isRef tests'(): void {
    expect(isRef([] as any)).to.eql(false);
    expect(isRef()).to.eql(false);
    const r = createRef('foo', 'bar');
    expect(isRef(r)).to.eql(true);
    expect(isRef(['foo' as any, 99 as any])).to.eql(false);
  }
}
