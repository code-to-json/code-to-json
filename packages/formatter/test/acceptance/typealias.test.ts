import { expect } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@timeout(1200)
@slow(800)
export class TypeAliasAcceptanceTests {
  @test public async 'type Bar = { foo: string }'() {
    const code = "export function foo() { return 'bar'; }";
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const functionSymbol = t.resolveReference(fileSymbol.exports!.foo);
    expect(functionSymbol.name).to.eql('foo');
    //     const { data, cleanup } = await fullFormattedOutput(`export type Bar = { foo: string }`);
    //     snapshot(data);
    //     cleanup();
    //   }
    //   @test public async 'conditional type'() {
    //     const { data, cleanup } = await fullFormattedOutput(
    //       `export type Bar<T> = T extends string ? T : number[];
    // export const x: Bar<'foo'> = 'foo';
    // export const y: Bar<Promise<string>> = [1, 2, 3];`,
    //     );
    //     snapshot(data);
    //     cleanup();
  }
}
