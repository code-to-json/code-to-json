import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { join } from 'path';
import { findPkgJson } from '../src/package-json';

@suite
export class PackageJsonUtilitiesTests {
  @test
  public async 'findPkgJson for a package within this monorepo'(): Promise<void> {
    const pkg = await findPkgJson(__dirname);
    if (!pkg) {
      throw new Error('could not find package.json info');
    }
    const knownPath = join(__dirname, '..');
    expect(pkg.path).to.eq(knownPath);
  }

  @test
  public async 'findPkgJson the main monorepo'(): Promise<void> {
    const pkg = await findPkgJson(join(__dirname, '..', '..'));
    if (!pkg) {
      throw new Error('could not find package.json info');
    }
    const knownPath = join(__dirname, '..', '..', '..');
    expect(pkg.path).to.eq(knownPath);
  }

  @test
  public async 'findPkgJson outside this project'(): Promise<void> {
    const pkg = await findPkgJson(join(__dirname, '..', '..', '..', '..'));
    expect(pkg).to.eq(undefined);
  }

  @test
  public async 'attempting to pass invalid arguments'(): Promise<void> {
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
  }
}
