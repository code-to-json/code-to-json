import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { createRef } from '../src/deferred-processing/ref';
import { isRef } from '../src/index';

declare module '../src/deferred-processing/ref-registry' {
  export default interface RefRegistry {
    foo: ['foo', string];
  }
}

@suite
class RefTests {
  @test
  public 'isRef tests'(): void {
    expect(isRef([] as any)).to.eql(false);
    expect(isRef()).to.eql(false);
    const r = createRef('foo', '1231');
    expect(isRef(r)).to.eql(true);
    expect(isRef(['foo' as any, 99 as any])).to.eql(false);
  }
}
