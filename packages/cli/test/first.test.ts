import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { runCli } from '../src/index';

@suite
class PublicApiSurface {
  @test
  public method(): void {
    expect(runCli).to.be.a('function');
  }
}
