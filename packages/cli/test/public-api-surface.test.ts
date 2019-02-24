import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as Exported from '../src/index';

describe('public API surface tests', () => {
  it('runCli method exists', () => {
    expect(Exported.runCli).to.be.a('function');
  });

  it('no extra exports', () => {
    expect(Object.keys(Exported).sort()).to.eql(['generateJSONCommand', 'runCli']);
  });
});
