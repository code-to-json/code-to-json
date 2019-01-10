/**
 * This is the index file
 * @author Mike
 * @file foo
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
