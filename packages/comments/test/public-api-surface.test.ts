import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as Exported from '../src/index';

const { parseCommentString, parser } = Exported;

describe('Public API surface tests', () => {
  it('public API surface is as expected', () => {
    expect(parseCommentString).to.be.a('function', 'parseCommentString is a function');
    expect(parser).to.be.a('object', 'parser is an object');
  });

  it('no extra exports', () => {
    expect(Object.keys(Exported).sort()).to.eql(['parseCommentString', 'parser']);
  });
});
