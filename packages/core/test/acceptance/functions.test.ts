import { suite, test } from 'mocha-typescript';
import * as snapshot from 'snap-shot-it';
import { disableIf, fullWalkerOutput } from './helpers';

@suite
@disableIf(!!process.env.AZURE_HTTP_USER_AGENT)
export class FunctionAnalysisTests {
  @test
  public async 'zero-argument function'(): Promise<void> {
    const { data, cleanup } = await fullWalkerOutput(`export function foo() { return 'bar'; }`);
    snapshot(data);
    cleanup();
  }

  @test
  public async 'unary function'(): Promise<void> {
    const { data, cleanup } = await fullWalkerOutput(
      `export function foo(str: string) { return str.toUpperCase(); }`,
    );
    snapshot(data);
    cleanup();
  }

  @test
  public async 'function with multiple signatures'(): Promise<void> {
    const { data, cleanup } = await fullWalkerOutput(
      `
export function adder(a: string, b: string): string;
export function adder(a: number, b: number): number;
export function adder(a: number|string, b: number|string): number|string {
  return a + b;
}
`,
    );
    snapshot(data);
    cleanup();
  }
}
