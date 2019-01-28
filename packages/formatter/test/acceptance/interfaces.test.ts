import { slow, suite, timeout } from 'mocha-typescript';

@suite
@timeout(1200)
@slow(800)
export class InterfaceAcceptanceTests {
  // @test public async 'simple interface'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export interface Foo { bar: string; }`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'interface w/ type param'() {
  //   const { data, cleanup } = await fullFormattedOutput(`export interface Foo<T> { bar: T; }`);
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'interface w/ constrained type param'() {
  //   const { data, cleanup } = await fullFormattedOutput(
  //     `export interface Foo<T extends number> { bar: T; }`,
  //   );
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'interface w/ string index signature'() {
  //   const { data, cleanup } = await fullFormattedOutput(
  //     `export interface Dict<T> { [k: string]: T }`,
  //   );
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'interface w/ index signature involving union type'() {
  //   const { data, cleanup } = await fullFormattedOutput(
  //     `export interface Dict<T> { [k: string]: T | T[] }`,
  //   );
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'interface w/ index signature involving union and intersection types'() {
  //   const { data, cleanup } = await fullFormattedOutput(
  //     `export interface Dict<T> { [k: string]: (T | T[]) & { foo: string } }`,
  //   );
  //   snapshot(data);
  //   cleanup();
  // }
  // @test public async 'interface w/ string and number index signatures'() {
  //   const { data, cleanup } = await fullFormattedOutput(
  //     `export interface Dict<T> { [k: string]: T; [k: number]: T[]; }`,
  //   );
  //   snapshot(data);
  //   cleanup();
  // }
}
