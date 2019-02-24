import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as Exported from '../src/index';

describe('Public API surface tests', () => {
  it('NODE_HOST object exists', () => {
    expect(Exported.NODE_HOST).to.be.a('object');
  });

  it('createReverseResolverForProject exists', () => {
    expect(Exported.createReverseResolverForProject).to.be.a('function');
  });

  it('findPkgJson exists', () => {
    expect(Exported.findPkgJson).to.be.a('function');
  });

  it('no extra exports', () => {
    expect(Object.keys(Exported).sort()).to.eql([
      'NODE_HOST',
      'createReverseResolverForProject',
      'findPkgJson',
    ]);
  });
});
