import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { trimParagraphContent } from '../src/parse/utils';

@suite
export class CommentUtilTest {
  @test
  public async 'content array trimming'(): Promise<void> {
    expect(trimParagraphContent(['\n', '\n', 'foo', '\n', 'bar'])).to.deep.eq(['foo', '\n', 'bar']);
    expect(trimParagraphContent(['\n', '\n', 'foo', '\n', 'bar', '\n', '\n'])).to.deep.eq([
      'foo',
      '\n',
      'bar',
    ]);
    expect(trimParagraphContent(['foo', '\n', 'bar'])).to.deep.eq(['foo', '\n', 'bar']);
  }
}
