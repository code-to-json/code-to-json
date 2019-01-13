import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { singleExportModuleExports } from './helpers';

@suite
class FunctionAnalysisTests {
  @test
  public async 'zero-argument function'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports(
      `export function foo() { return 'bar'; }`,
    );
    expect(exports).to.deep.eq({
      foo: {
        name: 'foo',
        type: {
          flags: ['Object'],
          objectFlags: ['Anonymous'],
          typeKind: 'custom',
          typeString: '() => string',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'unary function'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports(
      `export function foo(str: string) { return str.toUpperCase(); }`,
    );
    expect(exports).to.deep.eq({
      foo: {
        name: 'foo',
        type: {
          flags: ['Object'],
          objectFlags: ['Anonymous'],
          typeKind: 'custom',
          typeString: '(str: string) => string',
        },
      },
    });
    cleanup();
  }

  @test
  public async 'function with multiple signatures'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports(
      `
export function adder(a: string, b: string): string;
export function adder(a: number, b: number): number;
export function adder(a: number|string, b: number|string): number|string {
  return a + b;
}
`,
    );
    expect(exports).to.deep.eq({
      adder: {
        name: 'adder',
        type: {
          flags: ['Object'],
          objectFlags: ['Anonymous'],
          typeKind: 'custom',
          typeString: '{ (a: string, b: string): string; (a: number, b: number): number; }',
        },
      },
    });
    cleanup();
  }
}
