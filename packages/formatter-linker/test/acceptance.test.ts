import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
export class FormatterLinkerAcceptanceTests {
  @test
  public async 'linking completes without error'(): Promise<void> {
    const code = 'export let x: string[] = ["33"];';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();

    expect(file.symbol!.name)
      .to.contain('src')
      .to.contain('index');
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

export class Thing implements Foo<string> {
  bar: [string, string] = ['a', 'b'];
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

    expect(file.symbol!.name)
      .to.contain('src')
      .to.contain('index');
    expect(file.symbol!.exports!.Foo!.type!.text).to.eq('Foo<T>');
    expect(file.symbol!.exports!.FooOrBar!.type!.text).to.eq('FooOrBar<T>');
    expect(file.symbol!.exports!.x!.valueType!.text).to.eq('string[]');
    expect(file.symbol!.exports!.Thing!.valueType!.text).to.eq('typeof Thing');
    expect(file.symbol!.exports!.Thing!.type!.text).to.eq('Thing');
    expect(file.symbol!.exports!.Thing!.heritageClauses!.length).to.eq(1);
    expect(file.symbol!.exports!.Thing!.heritageClauses![0].kind).to.eq('implements');
    expect(file.symbol!.exports!.Thing!.heritageClauses![0].types[0].text).to.eq('Foo<string>');
    expect(
      mapDict(file.symbol!.exports!.Thing!.type!.properties!, (p) => p.valueType!.text),
    ).to.deep.eq({
      bar: '[string, string]',
      go: '() => Promise<string>',
      myProp: 'string',
      otherThing: 'number[]',
    });
    t.cleanup();
  }
}
