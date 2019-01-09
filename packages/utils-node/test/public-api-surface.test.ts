import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as Exported from '../src/index';

@suite
class PublicApiSurfaceTests {
  @test
  public 'nodeHost object exists'(): void {
    expect(Exported.nodeHost).to.be.a('object');
  }

  @test
  public 'pathNormalizerForPackageJson exists'(): void {
    expect(Exported.pathNormalizerForPackageJson).to.be.a('function');
  }

  @test
  public 'findPkgJson exists'(): void {
    expect(Exported.findPkgJson).to.be.a('function');
  }

  @test
  public 'no extra exports'(): void {
    expect(Object.keys(Exported).sort()).to.eql([
      'findPkgJson',
      'nodeHost',
      'pathNormalizerForPackageJson',
    ]);
  }
}
