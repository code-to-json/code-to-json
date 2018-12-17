import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { UnreachableError } from '../src/index';

declare module '../src/deferred-processing/ref-registry' {
  export default interface RefRegistry {
    foo: ['foo', string];
  }
}

@suite
class ErrorTests {
  @test
  public 'UnreachableError tests'(): void {
    expect(() => {
      throw new UnreachableError('' as never);
    }).to.throw('Reached code that should be unreachable');
  }
}
