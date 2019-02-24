import { expect } from 'chai';
import { describe, it } from 'mocha';
import { formattedSchema } from '../src/index';

describe('Public API surface tests', () => {
  it('schema exists', () => {
    expect(formattedSchema).to.be.a('object');
  });
});
