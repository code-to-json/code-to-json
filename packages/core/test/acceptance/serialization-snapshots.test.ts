import { suite, test } from 'mocha-typescript';
import * as snapshot from 'snap-shot-it';
import { disableIf, fullWalkerOutput } from './helpers';

@suite
@disableIf(!!process.env.AZURE_HTTP_USER_AGENT)
export class SerializationSnapshotTests {
  @test public async 'const x = "foo"'() {
    const {
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput('export const x = "foo";');
    // Fix due to flag changes in TS 3.0 -> TS 3.2
    const { flags }: { flags: string[] } = types.T01m4wmr2q7oq! as any;
    if (flags.includes('FreshLiteral')) {
      flags.pop();
    }
    snapshot({ types, symbols });
    cleanup();
  }

  @test public async 'let x = "foo"'() {
    const {
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput('export let x = "foo";');
    // project://packages/core/__snapshots__/serialization-snapshots.test.ts.js
    snapshot({ types, symbols });
    cleanup();
  }

  @test public async 'function add(a: number, b: string) { return a + b; }'() {
    const {
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput('export function add(a: number, b: string) { return a + b; }');
    snapshot({ types, symbols });
    cleanup();
  }

  @test public async 'const p: Promise<number> = Promise.resolve(4);'() {
    const {
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput('export const p: Promise<number> = Promise.resolve(4);');
    snapshot({ types, symbols });
    cleanup();
  }

  @test public async 'interface Foo {bar: number; readonly baz: Promise<string>}'() {
    const {
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(
      'export default interface Foo {bar: number; readonly baz: Promise<string>}',
    );
    snapshot({ types, symbols });
    cleanup();
  }

  @test public async 'class Vehicle { numWheels: number = 4; drive() { return "vroom";} }'() {
    const {
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(
      `export class Vehicle {
  public numWheels: number = 4;

  public drive() {
    return 'vroom';
  }
}`,
    );
    snapshot({ types, symbols });
    cleanup();
  }

  @test
  public async 'abstract class Vehicle { numWheels: number = 4; abstract drive(): string; }'() {
    const {
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(
      `export abstract class Vehicle {
  public numWheels: number = 4;

  public abstract drive(): string;
}`,
    );
    snapshot({ types, symbols });
    cleanup();
  }

  @test
  public async 'type Dict<T> = { [k: string]: T | undefined }'() {
    const {
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(`export type Dict<T> = { [k: string]: T | undefined }`);
    snapshot({ types, symbols });
    cleanup();
  }

  @test
  public async 'type Dict<T extends "foo"|"bar"|"baz"> = { [k: string]: T | undefined }'() {
    const {
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(
      `export type Dict<T extends "foo"|"bar"|"baz"> = { [k: string]: T | undefined }`,
    );
    // Fix due to flag changes in TS 3.0 -> TS 3.2
    const flags = types.T01m4wntf4uds!.flags!;
    if (flags.includes('UnionOfUnitTypes')) {
      const idx = flags.indexOf('UnionOfUnitTypes');
      flags.splice(idx, 1);
    }
    snapshot({ types, symbols });
    cleanup();
  }

  @test.skip public async 'type Resolve = typeof Promise.resolve'() {
    const {
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput('export type Resolve = typeof Promise.resolve;');
    snapshot({ types, symbols });
    cleanup();
  }
}
