import { expect } from 'chai';
import { describe, it } from 'mocha';
import { UnreachableError } from '../src/index';

describe('Error tests', () => {
  it('UnreachableError tests', () => {
    expect(() => {
      throw new UnreachableError('' as never);
    }).to.throw('Reached code that should be unreachable');
  });
});
