import { expect } from 'chai';
import { describe, it } from 'mocha';
import formatFlags from '../../src/flags';

describe('Flag formatting tests', () => {
  it('pass-through (capitalization only) flags', async () => {
    [
      'Class',
      'Function',
      'Property',
      'Alias',
      'Method',
      'TypeAlias',
      'Object',
      'Void',
      'Reference',
      'NumberLiteral',
      'Number',
      'String',
      'Interface',
      'Prototype',
      'Constructor',
      'TypeParameter',
    ].forEach(flag => {
      expect(formatFlags([flag])).to.eql([flag[0].toLowerCase() + flag.substr(1)]);
    });
  });

  it('undefined flag', async () => {
    expect(formatFlags()).to.eql([]);
  });

  it('blockScopedVariable', async () => {
    expect(formatFlags(['BlockScopedVariable'])).to.eql(['variable']);
  });

  it('valueModule', async () => {
    expect(formatFlags(['ValueModule'])).to.eql(['module']);
  });

  it('null flag', async () => {
    expect(() => formatFlags(null as any)).to.throw('Reached code that should be unreachable');
  });
});
