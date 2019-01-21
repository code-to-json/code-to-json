import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { timeout } from '../src/index';

@suite
export class PromiseTests {
  @test
  public async 'timeout tests'(): Promise<void> {
    let resolved = false;
    const p = timeout(100).then(() => {
      resolved = true;
    });
    expect(typeof p).to.eql('object', 'timeout returns an object');
    expect(typeof p.then).to.eql('function', 'timeout returns a promise');
    expect(resolved).to.eq(false, 'short timeout resolves sooner than longer timeout (1)');
    await timeout(101);
    expect(resolved).to.eq(true, 'short timeout resolves sooner than longer timeout (2)');
  }
}
