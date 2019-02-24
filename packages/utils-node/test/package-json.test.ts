import { expect } from 'chai';
import { describe, it } from 'mocha';
import { join } from 'path';
import { findPkgJson } from '../src/package-json';

describe('package.json utilities tests', () => {
  it('findPkgJson for a package within this monorepo', async () => {
    const pkg = await findPkgJson(__dirname);
    if (!pkg) {
      throw new Error('could not find package.json info');
    }
    const knownPath = join(__dirname, '..');
    expect(pkg.path).to.eq(knownPath);
  });

  it('findPkgJson the main monorepo', async () => {
    const pkg = await findPkgJson(join(__dirname, '..', '..'));
    if (!pkg) {
      throw new Error('could not find package.json info');
    }
    const knownPath = join(__dirname, '..', '..', '..');
    expect(pkg.path).to.eq(knownPath);
  });

  it('findPkgJson outside this project', async () => {
    const pkg = await findPkgJson(join(__dirname, '..', '..', '..', '..'));
    expect(pkg).to.eq(undefined);
  });

  it('attempting to pass invalid arguments', async () => {
    try {
      await findPkgJson(null as any);
      expect(false).to.eq(true); // should never reach this
    } catch (err) {
      if (err instanceof Error) {
        expect(err.message).to.contain('invalid searchPath');
      } else {
        expect(false).to.eq(true); // should never reach this
      }
    }
  });
});
