import { expect } from 'chai';
import { UnreachableError } from '../src/index';
import { describe, it } from 'mocha';

describe('Error tests', () => {
  it('UnreachableError tests', () => {
    expect(() => {
      throw new UnreachableError('' as never);
    }).to.throw('Reached code that should be unreachable');
  });
});
