import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import formatFlags from '../../src/flags';

@suite
export class FlagFormatterTests {
  @test
  public async 'pass-through (capitalization only) flags'(): Promise<void> {
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
    ].forEach((flag) => {
      expect(formatFlags([flag])).to.eql([flag[0].toLowerCase() + flag.substr(1)]);
    });
  }

  @test
  public async 'undefined flag'(): Promise<void> {
    expect(formatFlags()).to.eql([]);
  }

  @test
  public async blockScopedVariable(): Promise<void> {
    expect(formatFlags(['BlockScopedVariable'])).to.eql(['variable']);
  }

  @test
  public async valueModule(): Promise<void> {
    expect(formatFlags(['ValueModule'])).to.eql(['module']);
  }

  @test
  public async 'null flag'(): Promise<void> {
    expect(() => formatFlags(null as any)).to.throw('Reached code that should be unreachable');
  }
}
