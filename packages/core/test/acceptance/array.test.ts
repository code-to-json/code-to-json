import { slow, suite, test, timeout } from 'mocha-typescript';
import * as snapshot from 'snap-shot-it';
import { fullWalkerOutput } from './helpers';

@suite
@slow(800)
@timeout(1200)
export class ArraySerializationTests {
  @test.only
  public async 'string[]'(): Promise<void> {
    const { data, cleanup } = await fullWalkerOutput(`export const x: string[] = ['foo', 'bar']`);
    snapshot(data);
    cleanup();
  }

  @test.only
  public async '[string, number, number]'(): Promise<void> {
    const { data, cleanup } = await fullWalkerOutput(
      `export const x: [string, number, number] = ['foo', 1, 42]`,
    );
    snapshot(data);
    cleanup();
  }
}
