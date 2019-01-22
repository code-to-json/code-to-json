import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as snapshot from 'snap-shot-it';
import { fullWalkerOutput } from './helpers';

const disableIf: (predicate: boolean) => ClassDecorator = predicate => target => {
  if (predicate) {
    Object.getOwnPropertyNames(target.prototype).forEach(methodName => {
      if (methodName === 'constructor') {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      target.prototype[methodName] = () => {
        expect(true).to.eq(true);
      };
    });
  }
};

@suite
@disableIf(!!process.env.DISABLE_SNAPSHOT_TESTS)
export class SerializationSnapshotTests {
  @test public async 'const x = "foo"'() {
    const {
      data: { types, symbols },
      cleanup,
    } = await fullWalkerOutput('export const x = "foo";');
    // Fix due to flag changes in TS 3.0 -> TS 3.2
    const { flags }: { flags: string[] } = types['01m4wmrpputn']! as any;
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
    const flags = types['01m4wnnc9m2y']!.flags!;
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
