// tslint:disable no-identical-functions

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { singleExportModuleExports } from './helpers';

@suite
class TypeSerialiationBoundaryTests {
  @test
  public async 'export const x: number = 1;'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports('export const x: number = 1;');
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Number'],
          typeKind: 'core',
          typeString: 'number',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'export const x = 1;'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports('export const x = 1;');
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['NumberLiteral'],
          typeKind: 'core',
          typeString: '1',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'export let x = 1;'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports('export let x = 1;');
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Number'],
          typeString: 'number',
          typeKind: 'core',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'export let x: string | number = 33;'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports(
      'export let x: string | number = 33;',
    );
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Union'],
          typeKind: 'core',
          typeString: 'string | number',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'export let x: string[] = ["33"];'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports(
      'export let x: string[] = ["33"];',
    );
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Object'],
          typeKind: 'built-in',
          libName: 'lib.es5.d.ts',
          typeString: 'string[]',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'export const x: Promise<number> = Promise.resolve(4);'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports(
      'export const x: Promise<number> = Promise.resolve(4);',
    );
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Object'],
          libName: 'lib.es5.d.ts',
          typeKind: 'built-in',
          typeString: 'Promise<number>',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'export const x: { p: Promise<number[]> } = { p: Promise.resolve([1, 2, 3]) };'(): Promise<
    void
  > {
    const { exports, cleanup } = await singleExportModuleExports(
      'export const x: { p: Promise<number[]> } = { p: Promise.resolve([1, 2, 3]) };',
    );
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Object'],
          objectFlags: ['Anonymous'],
          typeKind: 'custom',
          typeString: '{ p: Promise<number[]>; }',
        },
      },
    });
    cleanup();
  }
}
