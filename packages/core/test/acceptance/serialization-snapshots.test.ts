import { suite, test } from 'mocha-typescript';
import { disableIf, fullWalkerOutput, sanitizedSnapshot } from './helpers';

@suite
@disableIf(!!process.env.AZURE_HTTP_USER_AGENT)
export class SerializationSnapshotTests {
  @test public async 'const x = "foo"'() {
    const {
      data: { types, symbols },
      rootPath,
      cleanup,
    } = await fullWalkerOutput('export const x = "foo";');
    // Fix due to flag changes in TS 3.0 -> TS 3.2
    const { flags }: { flags: string[] } = types.T01m4wmr2q7oq! as any;
    if (flags.includes('FreshLiteral')) {
      flags.pop();
    }
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test public async 'let x = "foo"'() {
    const {
      rootPath,
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput('export let x = "foo";');
    // project://packages/core/__snapshots__/serialization-snapshots.test.ts.js
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test public async 'function add(a: number, b: string) { return a + b; }'() {
    const {
      rootPath,
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput('export function add(a: number, b: string) { return a + b; }');
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test public async 'const p: Promise<number> = Promise.resolve(4);'() {
    const {
      rootPath,
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput('export const p: Promise<number> = Promise.resolve(4);');
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test public async 'interface Foo {bar: number; readonly baz: Promise<string>}'() {
    const {
      rootPath,
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(
      'export default interface Foo {bar: number; readonly baz: Promise<string>}',
    );
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test public async 'class Vehicle { numWheels: number = 4; drive() { return "vroom";} }'() {
    const {
      rootPath,
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
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test
  public async 'abstract class Vehicle { numWheels: number = 4; abstract drive(): string; }'() {
    const {
      rootPath,
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(
      `export abstract class Vehicle {
  public numWheels: number = 4;

  public abstract drive(): string;
}`,
    );
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test
  public async 'type Dict<T> = { [k: string]: T | undefined }'() {
    const {
      rootPath,
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(`export type Dict<T> = { [k: string]: T | undefined }`);
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test
  public async 'type Dict<T extends "foo"|"bar"|"baz"> = { [k: string]: T | undefined }'() {
    const {
      rootPath,
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
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test.skip public async 'type All = typeof Promise.all'() {
    const {
      rootPath,
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput('export type All = typeof Promise.all;');
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test public async 'Class with implied constructor'() {
    const {
      rootPath,
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(`export class SimpleClass { }`);
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test public async 'Class with properties and methods'() {
    const {
      rootPath,
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(`export class SimpleClass {
  constructor(bar: string) { console.log(bar); }
  public foo: string = 'bar';
  baz(x: number[]): number { x[0] * return Math.random(); }
}`);
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test public async 'Class with properties, methods and static functions'() {
    const {
      rootPath,
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(`export class SimpleClass {
  constructor(bar: string) { console.log(bar); }
  public foo: string = 'bar';
  static hello(): string { return 'world'; }
}`);
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }

  @test
  public async 'Class with properties, methods and static functions using a variety of access modifier keywords'() {
    const {
      rootPath,
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput(`export abstract class SimpleClass {

  protected static hello(): string { return 'world'; }
  
  protected readonly foo: string = 'bar';

  private constructor(bar: string) { console.log(bar); }
}`);
    sanitizedSnapshot({ types, symbols }, { replace: [[rootPath, '--ROOT PATH--']] });
    cleanup();
  }
}
