import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { formattedSchema } from '../src/index';

@suite
export class PublicApiSurface {
  @test
  public 'schema exists'(): void {
    expect(formattedSchema).to.be.a('object');
  }
}
