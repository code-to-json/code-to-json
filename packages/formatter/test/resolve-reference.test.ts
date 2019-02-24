import { createRef, Ref } from '@code-to-json/utils';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import resolveReference from '../src/resolve-reference';

describe('Resolve reference tests', () => {
  it('type', () => {
    const typeRef: Ref<'type'> = (createRef as any)('type', '12345');
    const resolved = resolveReference(
      {
        types: {
          12345: {
            id: '12345',
          },
        },
      } as any,
      typeRef,
    );
    expect(resolved).to.deep.eq({ id: '12345' });
  });

  it('symbol', () => {
    const symbolRef: Ref<'symbol'> = (createRef as any)('symbol', '12345');
    const resolved = resolveReference(
      {
        symbols: {
          12345: {
            id: '12345',
          },
        },
      } as any,
      symbolRef,
    );
    expect(resolved).to.deep.eq({ id: '12345' });
  });

  it('node', () => {
    const nodeRef: Ref<'node'> = (createRef as any)('node', '12345');
    const resolved = resolveReference(
      {
        nodes: {
          12345: {
            id: '12345',
          },
        },
      } as any,
      nodeRef,
    );
    expect(resolved).to.deep.eq({ id: '12345' });
  });

  it('declaration', () => {
    const declarationRef: Ref<'declaration'> = (createRef as any)('declaration', '12345');
    const resolved = resolveReference(
      {
        declarations: {
          12345: {
            id: '12345',
          },
        },
      } as any,
      declarationRef,
    );
    expect(resolved).to.deep.eq({ id: '12345' });
  });

  it('sourceFile', () => {
    const sourceFileRef: Ref<'sourceFile'> = (createRef as any)('sourceFile', '12345');
    const resolved = resolveReference(
      {
        sourceFiles: {
          12345: {
            id: '12345',
          },
        },
      } as any,
      sourceFileRef,
    );
    expect(resolved).to.deep.eq({ id: '12345' });
  });
});
