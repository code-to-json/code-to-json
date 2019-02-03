import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as Exports from '../src/index';

const { formatWalkerOutput } = Exports;

@suite
export class PublicApiSurface {
  @test
  public 'formatWalkerOutput exists'(): void {
    expect(formatWalkerOutput).to.be.a('function');
  }

  @test
  public 'only intended exports'(): void {
    expect(Object.keys(Exports).sort()).to.deep.eq(['formatWalkerOutput']);
  }
}
