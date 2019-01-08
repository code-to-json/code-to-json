// tslint:disable no-duplicate-string
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import * as ts from 'typescript';
import { generateModulePathNormalizer, SysHost } from '../src/index';

const host: SysHost = {
  readFileSync: ts.sys.readFile,
  writeFileSync: ts.sys.writeFile,
  directoryExists: ts.sys.directoryExists,
  fileExists: ts.sys.fileExists,
  pathRelativeTo(from: string, to: string) {
    return path.relative(from, to);
  },
  combinePaths(...paths: string[]): string {
    return path.join(...paths);
  },
};

@suite.only
class ModulePathNormalizerTests {
  @test
  public async 'no project folder or main'() {
    const mn = generateModulePathNormalizer(host);
    expect(mn.filePathToModuleInfo('foo/bar/baz.ts')).to.deep.eq({
      originalFileName: 'foo/bar/baz.ts',
      relativePath: 'foo/bar/baz',
      moduleName: 'foo/bar/baz',
      extension: 'ts',
    });

    expect(mn.filePathToModuleInfo('baz.ts')).to.deep.eq({
      originalFileName: 'baz.ts',
      relativePath: 'baz',
      moduleName: 'baz',
      extension: 'ts',
    });

    expect(mn.filePathToModuleInfo('.foorc.ts')).to.deep.eq({
      originalFileName: '.foorc.ts',
      relativePath: '.foorc',
      moduleName: '.foorc',
      extension: 'ts',
    });

    expect(mn.filePathToModuleInfo('.foorc')).to.deep.eq({
      originalFileName: '.foorc',
      relativePath: '.foorc',
      moduleName: '.foorc',
      extension: null,
    });

    expect(mn.filePathToModuleInfo('bin/code-to-json')).to.deep.eq({
      originalFileName: 'bin/code-to-json',
      relativePath: 'bin/code-to-json',
      moduleName: 'bin/code-to-json',
      extension: null,
    });
  }

  @test
  public async 'yes project folder, no main'() {
    const mn = generateModulePathNormalizer(host, { path: 'foo/bar', name: 'biz' });
    expect(mn.filePathToModuleInfo('foo/bar/baz.ts')).to.deep.eq({
      originalFileName: 'foo/bar/baz.ts',
      relativePath: 'baz',
      moduleName: 'biz/baz',
      extension: 'ts',
    });
  }

  @test
  public async 'yes project folder, yes main'() {
    const mn = generateModulePathNormalizer(host, {
      path: 'foo/bar',
      name: 'biz',
      main: 'src/main.ts',
    });

    expect(mn.filePathToModuleInfo('foo/bar/src/baz.ts')).to.deep.eq({
      originalFileName: 'foo/bar/src/baz.ts',
      relativePath: 'src/baz',
      moduleName: 'biz/baz',
      extension: 'ts',
    });

    expect(mn.filePathToModuleInfo('foo/bar/src/main.ts')).to.deep.eq({
      originalFileName: 'foo/bar/src/main.ts',
      relativePath: 'src/main',
      moduleName: 'biz',
      extension: 'ts',
    });
  }

  @test
  // tslint:disable-next-line:no-identical-functions
  public async 'scoped packages'() {
    const mn = generateModulePathNormalizer(host, {
      path: 'foo/bar',
      name: '@code-to-json/cli',
      main: 'src/index.ts',
    });

    expect(mn.filePathToModuleInfo('foo/bar/src/baz.ts')).to.deep.eq({
      originalFileName: 'foo/bar/src/baz.ts',
      relativePath: 'src/baz',
      moduleName: '@code-to-json/cli/baz',
      extension: 'ts',
    });

    expect(mn.filePathToModuleInfo('foo/bar/src/index.ts')).to.deep.eq({
      originalFileName: 'foo/bar/src/index.ts',
      relativePath: 'src/index',
      moduleName: '@code-to-json/cli',
      extension: 'ts',
    });
  }
}
