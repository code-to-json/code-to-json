import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { runCli } from '../src/index';

@suite
class PublicApiSurfaceTests {
  @test
  public 'runCli method exists'(): void {
    expect(runCli).to.be.a('function');
  }
}
