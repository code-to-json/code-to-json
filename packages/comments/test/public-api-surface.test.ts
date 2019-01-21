import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as Exported from '../src/index';

const { parseCommentString, parser } = Exported;

@suite
export class PublicApiSurface {
  @test
  public 'public API surface is as expected'(): void {
    expect(parseCommentString).to.be.a('function', 'parseCommentString is a function');
    expect(parser).to.be.a('object', 'parser is an object');
  }

  @test
  public 'no extra exports'(): void {
    expect(Object.keys(Exported).sort()).to.eql(['parseCommentString', 'parser']);
  }
}
