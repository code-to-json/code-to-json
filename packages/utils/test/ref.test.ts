import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createRef } from '../src/deferred-processing/ref';
import { isRef } from '../src/index';

describe('Ref tests', () => {
  it('isRef tests', () => {
    expect(isRef([] as any)).to.eql(false);
    expect(isRef()).to.eql(false);
    const r = createRef<{ foo: string }, 'foo'>('foo', '1231');
    expect(isRef(r)).to.eql(true);
    expect(isRef(['foo' as any, 99 as any])).to.eql(false);
  });
});
