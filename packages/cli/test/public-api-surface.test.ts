import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as Exported from '../src/index';

@suite
export class PublicApiSurfaceTests {
  @test
  public 'runCli method exists'(): void {
    expect(Exported.runCli).to.be.a('function');
  }

  @test
  public 'no extra exports'(): void {
    expect(Object.keys(Exported).sort()).to.eql(['generateJSONCommand', 'runCli']);
  }
}
