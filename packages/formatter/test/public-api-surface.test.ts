import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as Exports from '../src/index';

const { formatWalkerOutput } = Exports;

describe('Public API surface tests', () => {
  it('formatWalkerOutput exists', () => {
    expect(formatWalkerOutput).to.be.a('function');
  });

  it('only intended exports', () => {
    expect(Object.keys(Exports).sort()).to.deep.eq(['formatWalkerOutput']);
  });
});
