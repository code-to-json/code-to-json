import { expect } from 'chai';
import { describe, it } from 'mocha';
import { trimParagraphContent } from '../src/parse/utils';

describe('Comment utilities tests', () => {
  it('content array trimming', async () => {
    expect(trimParagraphContent(['\n', '\n', 'foo', '\n', 'bar'])).to.deep.eq(['foo', '\n', 'bar']);
    expect(trimParagraphContent(['\n', '\n', 'foo', '\n', 'bar', '\n', '\n'])).to.deep.eq([
      'foo',
      '\n',
      'bar',
    ]);
    expect(trimParagraphContent(['foo', '\n', 'bar'])).to.deep.eq(['foo', '\n', 'bar']);
  });
});
