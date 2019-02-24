import { expect } from 'chai';
import { describe, it } from 'mocha';
import { getTsLibName } from '../src/ts-lib';

describe('TSLib tests', () => {
  it('invalid attemot to obtain the name of a tslib', () => {
    expect(getTsLibName('/Users/mike/foo/bar/index.ts')).to.eq(undefined);
  });

  it('valid attemot to obtain the name of a tslib', () => {
    expect(getTsLibName('/Users/mike/foo/bar/node_modules/typescript/lib/lib.es5.d.ts')).to.eq(
      'lib.es5.d.ts',
    );
  });
});
