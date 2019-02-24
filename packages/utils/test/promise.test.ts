import { expect } from 'chai';
import { describe, it } from 'mocha';
import { timeout } from '../src/index';

describe('Promise tests', () => {
  it('timeout tests', async () => {
    let resolved = false;
    const p = timeout(100).then(() => {
      resolved = true;
    });
    expect(typeof p).to.eql('object', 'timeout returns an object');
    expect(typeof p.then).to.eql('function', 'timeout returns a promise');
    expect(resolved).to.eq(false, 'short timeout resolves sooner than longer timeout (1)');
    await timeout(101);
    expect(resolved).to.eq(true, 'short timeout resolves sooner than longer timeout (2)');
  });
});
