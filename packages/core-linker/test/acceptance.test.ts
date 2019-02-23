import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
export class CoreLiknerAcceptanceTests {
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
  public bar = ['a', 'b'] as [string, string];
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
    const exportSymbols = file.symbol!.exports!;
    expect(exportSymbols.Foo!.symbolType!.text).to.eq('Foo<T>');
    expect(file.symbol!.valueDeclaration!).to.have.property('syntaxKind', 'sourceFile');
    expect(exportSymbols.FooOrBar!.symbolType!.text).to.eq('FooOrBar<T>');
    expect(exportSymbols.x!.valueDeclarationType!.text).to.eq('string[]');
    expect(exportSymbols.Thing!.valueDeclarationType!.text).to.eq('typeof Thing');
    expect(exportSymbols.Thing!.valueDeclaration).to.have.property(
      'syntaxKind',
      'classDeclaration',
    );
    expect(exportSymbols.Thing!.symbolType!.text).to.eq('Thing');
    expect(Object.keys(exportSymbols.Thing!.symbolType!.properties!).join(', ')).to.eq(
      'bar, myProp, otherThing, go',
    );
    expect(
      exportSymbols.Thing!.symbolType!.properties!.go!.valueDeclarationType!.callSignatures!.length,
    ).to.eq(1);
    expect(exportSymbols.Thing!.heritageClauses!.length).to.eq(1);
    expect(exportSymbols.Thing!.heritageClauses![0].kind).to.eq('implements');
    expect(exportSymbols.Thing!.heritageClauses![0].types[0].text).to.eq('Foo<string>');
    expect(
      mapDict(exportSymbols.Thing!.symbolType!.properties!, p => p.valueDeclarationType!.text),
    ).to.deep.eq({
      bar: '[string, string]',
      go: '() => Promise<string>',
      myProp: 'string',
      otherThing: 'number[]',
    });
    t.cleanup();
  }
}
