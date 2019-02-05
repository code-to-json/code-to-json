import { createRef, Ref } from '@code-to-json/utils';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import resolveReference from '../src/resolve-reference';

@suite
export class ResolveReferenceTests {
  @test
  public type(): void {
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
  }

  @test
  public symbol(): void {
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
  }

  @test
  public node(): void {
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
  }

  @test
  public declaration(): void {
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
  }

  @test
  public sourceFile(): void {
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
  }
}
