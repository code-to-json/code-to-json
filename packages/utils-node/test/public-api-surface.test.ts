import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as Exported from '../src/index';

@suite
export class PublicApiSurfaceTests {
  @test
  public 'NODE_HOST object exists'(): void {
    expect(Exported.NODE_HOST).to.be.a('object');
  }

  @test
  public 'createReverseResolverForProject exists'(): void {
    expect(Exported.createReverseResolverForProject).to.be.a('function');
  }

  @test
  public 'findPkgJson exists'(): void {
    expect(Exported.findPkgJson).to.be.a('function');
  }

  @test
  public 'no extra exports'(): void {
    expect(Object.keys(Exported).sort()).to.eql([
      'NODE_HOST',
      'createReverseResolverForProject',
      'findPkgJson',
    ]);
  }
}
