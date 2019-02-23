import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { createReverseResolver } from '../src/index';
import { nodeHost } from './helpers';

@suite
export class ModulePathNormalizerTests {
  @test
  public async 'no project folder or main'(): Promise<void> {
    const mn = createReverseResolver(nodeHost);
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
  public async 'yes project folder, no main'(): Promise<void> {
    const mn = createReverseResolver(nodeHost, { path: 'foo/bar', name: 'biz' });
    expect(mn.filePathToModuleInfo('foo/bar/baz.ts')).to.deep.eq({
      originalFileName: 'foo/bar/baz.ts',
      relativePath: 'baz',
      moduleName: 'biz/baz',
      extension: 'ts',
    });
  }

  @test
  public async 'yes project folder, yes main'(): Promise<void> {
    const mn = createReverseResolver(nodeHost, {
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
  public async 'scoped packages'(): Promise<void> {
    const mn = createReverseResolver(nodeHost, {
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
