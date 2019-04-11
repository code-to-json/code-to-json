/**
 * This is the index file
 *
 *
 * ## Usage
 *
 * This is how you use it
 *
 *
 * ## Installation
 *
 * This is how you install it
 *
 * ```sh
 * npm install foo
 * ```
 *
 * ### Another thing
 *
 * Special installation instructins
 *
 * * first
 * * second
 * * third
 *
 * 1. a
 * 1. b
 * 1. c
 *
 * ![corgi](https://placecorgi.herokuapp.com/300/200)
 *
 * @author Mike
 * @file foo
 *
 * This is how you do a thing
 *
 * ```ts
 * function foo() {}
 * ```
 * And another thing
 *
 * ```hbs
 * {{#if foo}} <span>bar</span> {{/if}}
 * ```
 */

/**
 * Add two numbers together
 * @param a first number
 * @param b second number
 */
export function add(a: number, b: number) {
  return a + b;
}

export const SECRET_STRING = 'shhhhh!';

export { default as Car } from './car';
export { Unicycle, Bike } from './cycles';

export enum Suit {
  Heart = 10,
  Spade,
  Club,
  Diamond,
}

export const foo: { thing: typeof SECRET_STRING } = { thing: 'shhhhh!' };
export const bar: { abc: typeof foo } = { abc: foo };
