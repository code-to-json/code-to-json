import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { join } from 'path';
import nodeHost from '../src/node-host';
import { pathNormalizerForPackageJson } from '../src/path-normalizer';

@suite
export class PathNormalizerTests {
  @test
  public async 'obtaining a non-passthrough normalizer'() {
    const normalizer = await pathNormalizerForPackageJson(__dirname, nodeHost);
    expect(!!normalizer).to.eq(true);
    expect((normalizer as any).__passthroughNormalizer).to.eq(undefined);
  }

  @test
  public async 'obtaining a passthrough normalizer'() {
    const normalizer = await pathNormalizerForPackageJson(
      join(__dirname, '..', '..', '..', '..', '..'),
      nodeHost,
    );
    expect(!!normalizer).to.eq(true);
    expect((normalizer as any).__passthroughNormalizer).to.eq(true);
  }

  @test
  public async 'accessing project root module through non-passthrough normalizer'() {
    const normalizer = await pathNormalizerForPackageJson(__dirname, nodeHost);
    const normalizedData = normalizer.filePathToModuleInfo(
      join(__dirname, '..', 'src', 'index.ts'),
    );
    expect(normalizedData.relativePath).to.eq('src/index');
    expect(normalizedData.extension).to.eq('ts');
    expect(normalizedData.moduleName).to.eq('@code-to-json/utils-node');
  }

  @test
  public async 'accessing project non-root module through non-passthrough normalizer'() {
    const normalizer = await pathNormalizerForPackageJson(__dirname, nodeHost);
    const normalizedData = normalizer.filePathToModuleInfo(
      join(__dirname, '..', 'src', 'node-host.ts'),
    );
    expect(normalizedData.relativePath).to.eq('src/node-host');
    expect(normalizedData.extension).to.eq('ts');
    expect(normalizedData.moduleName).to.eq('@code-to-json/utils-node/node-host');
  }
}
