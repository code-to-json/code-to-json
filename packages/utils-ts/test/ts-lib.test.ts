import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { getTsLibName } from '../src/ts-lib';

@suite
export class TsLibsTests {
  @test public 'invalid attemot to obtain the name of a tslib'(): void {
    expect(getTsLibName('/Users/mike/foo/bar/index.ts')).to.eq(undefined);
  }

  @test public 'valid attemot to obtain the name of a tslib'(): void {
    expect(getTsLibName('/Users/mike/foo/bar/node_modules/typescript/lib/lib.es5.d.ts')).to.eq(
      'lib.es5.d.ts',
    );
  }
}
