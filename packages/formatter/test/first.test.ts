import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { formatWalkerOutput } from '../src/index';

@suite
class PublicApiSurface {
  @test
  public 'formatWalkerOutput exists'(): void {
    expect(formatWalkerOutput).to.be.a('function');
  }
}
