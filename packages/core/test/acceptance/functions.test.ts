import { suite, test } from 'mocha-typescript';
import { disableIf, fullWalkerOutput, sanitizedSnapshot } from './helpers';

@suite
@disableIf(!!process.env.AZURE_HTTP_USER_AGENT)
export class FunctionAnalysisTests {
  @test
  public async 'zero-argument function'(): Promise<void> {
    const { data, cleanup, rootPath } = await fullWalkerOutput(
      `export function foo() { return 'bar'; }`,
    );
    sanitizedSnapshot(data, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test
  public async 'unary function'(): Promise<void> {
    const { data, rootPath, cleanup } = await fullWalkerOutput(
      `export function foo(str: string) { return str.toUpperCase(); }`,
    );
    sanitizedSnapshot(data, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test
  public async 'function with multiple signatures'(): Promise<void> {
    const { data, rootPath, cleanup } = await fullWalkerOutput(
      `
export function adder(a: string, b: string): string;
export function adder(a: number, b: number): number;
export function adder(a: number|string, b: number|string): number|string {
  return a + b;
}
`,
    );
    sanitizedSnapshot(data, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }
}
