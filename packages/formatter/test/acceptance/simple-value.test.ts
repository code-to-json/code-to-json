import { slow, suite, timeout } from 'mocha-typescript';

@suite
@timeout(1200)
@slow(800)
export class SimpleValueAcceptanceTests {
  // @test public async 'let x = "foo";'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export let x = 'foo';`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'const x = "foo";'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export const x = 'foo';`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'const x: string = "foo";'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export const x: string = 'foo';`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'const x: number = 42'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export const x: number = 42`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'let x: never'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export let x: never`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'const x = 42'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export const x = 42`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'const x = () => "foo";'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export const x = () => "foo";`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'const x: null = null'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export const x: null = null`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'const x = true'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export const x = true`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'const x: symbol = Symbol("abc");'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export const x: symbol = Symbol("abc");`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test.skip public async 'const x = Symbol("abc");'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export const x = Symbol("abc");`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'const x: any = 41'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export const x: any = 41`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'const x {foo: "bar"} = {foo: "bar" }'() {
  //   const { data, cleanup } = await fullFormattedOutput(
  //     `export const x {foo: "bar"} = {foo: "bar" }`,
  //   );
  //   snapshot(data);
  //   cleanup();
  // }
}
