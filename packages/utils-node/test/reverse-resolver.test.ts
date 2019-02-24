import { expect } from 'chai';
import { describe, it } from 'mocha';
import { join } from 'path';
import NODE_HOST from '../src/node-host';
import { createReverseResolverForProject } from '../src/reverse-resolver';

describe('Module path normalizer tests', () => {
  it('obtaining a non-passthrough normalizer', async () => {
    const normalizer = await createReverseResolverForProject(__dirname, NODE_HOST);
    expect(!!normalizer).to.eq(true);
    expect((normalizer as any).__passthroughNormalizer).to.eq(undefined);
  });

  it('obtaining a passthrough normalizer', async () => {
    const normalizer = await createReverseResolverForProject(
      join(__dirname, '..', '..', '..', '..', '..'),
      NODE_HOST,
    );
    expect(!!normalizer).to.eq(true);
    expect((normalizer as any).__passthroughNormalizer).to.eq(true);
  });

  it('accessing project root module through non-passthrough normalizer', async () => {
    const normalizer = await createReverseResolverForProject(__dirname, NODE_HOST);
    const normalizedData = normalizer.filePathToModuleInfo(
      join(__dirname, '..', 'src', 'index.ts'),
    );
    expect(normalizedData.relativePath).to.eq('src/index');
    expect(normalizedData.extension).to.eq('ts');
    expect(normalizedData.moduleName).to.eq('@code-to-json/utils-node');
  });

  it('accessing project non-root module through non-passthrough normalizer', async () => {
    const normalizer = await createReverseResolverForProject(__dirname, NODE_HOST);
    const data = normalizer.filePathToModuleInfo(join(__dirname, '..', 'src', 'node-host.ts'));
    expect(data.relativePath).to.eq('src/node-host');
    expect(data.extension).to.eq('ts');
    expect(data.moduleName).to.eq('@code-to-json/utils-node/node-host');
  });
});
