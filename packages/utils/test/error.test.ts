import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { UnreachableError } from '../src/index';

@suite
export class ErrorTests {
  @test
  public 'UnreachableError tests'(): void {
    expect(() => {
      throw new UnreachableError('' as never);
    }).to.throw('Reached code that should be unreachable');
  }
}
