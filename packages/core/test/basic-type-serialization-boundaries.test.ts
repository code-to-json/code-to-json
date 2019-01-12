// tslint:disable no-identical-functions

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { singleExportModuleExports } from './acceptance-test-helpers';

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
          typeString: '{ p: Promise<number[]>; }',
        },
      },
    });
    cleanup();
  }
}
