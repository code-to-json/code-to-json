import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
export class SimpleSnapshotSmokeTests {
  @test
  public async 'linking completes without error'(): Promise<void> {
    const code = 'export let x: string[] = ["33"];';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();

    expect(file.symbol!.name).to.eq('"--ROOT PATH--/src/index"');
    expect(file.symbol!.exports!.x!.name).to.eq('x');
    t.cleanup();
  }

  @test
  public async 'linking a sampler of various symbols and types'(): Promise<void> {
    const code = `export interface Foo<T> {
  bar: [T, string];
}

export type Bar<T> = { [k: string]: T }

export type FooOrBar<T> = T extends string ? Foo<T> : Bar<T>;

export let x: string[] = ["33"];

export class Thing {
  protected myProp = this.otherThing.join(', ');
  constructor(public otherThing: number[] = [12, 21]) {
  }
  async go() {
    console.log(this.otherThing);
    return this.myProp;
  }
}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();

    expect(file.symbol!.name).to.eq('"--ROOT PATH--/src/index"');
    expect(file.symbol!.exports!.Foo!.type!.text).to.eq('Foo<T>');
    expect(file.symbol!.exports!.FooOrBar!.type!.text).to.eq('FooOrBar<T>');
    expect(file.symbol!.exports!.x!.type!.text).to.eq('string[]');
    expect(file.symbol!.exports!.Thing!.type!.text).to.eq('typeof Thing');
    expect(file.symbol!.exports!.Thing!.type!.constructorSignatures![0].returnType!.text).to.eq(
      'Thing',
    );
    expect(
      mapDict(
        file.symbol!.exports!.Thing!.type!.constructorSignatures![0].returnType!.properties!,
        p => p.type!.text,
      ),
    ).to.deep.eq({
      go: '() => Promise<string>',
      myProp: 'string',
      otherThing: 'number[]',
    });
    t.cleanup();
  }
}
