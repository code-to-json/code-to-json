import { UnaryFunction } from './types';

/**
 * Create a pipeline of unary functions
 *
 * @public
 */
export function pipe(): <T>(x: T) => T;
export function pipe<A, R>(f1: UnaryFunction<A, R>): (a: A) => R;
export function pipe<A1, R1, R2>(
  f1: UnaryFunction<A1, R1>,
  f2: UnaryFunction<R1, R2>,
): (a: A1) => R2;
export function pipe<A1, R1, R2, R3>(
  f1: UnaryFunction<A1, R1>,
  f2: UnaryFunction<R1, R2>,
  f3: UnaryFunction<R2, R3>,
): (a: A1) => R3;
export function pipe<A1, R1, R2, R3, R4>(
  f1: UnaryFunction<A1, R1>,
  f2: UnaryFunction<R1, R2>,
  f3: UnaryFunction<R2, R3>,
  f4: UnaryFunction<R3, R4>,
): (a: A1) => R4;
export function pipe<A1, R1, R2, R3, R4, R5>(
  f1: UnaryFunction<A1, R1>,
  f2: UnaryFunction<R1, R2>,
  f3: UnaryFunction<R2, R3>,
  f4: UnaryFunction<R3, R4>,
  f5: UnaryFunction<R4, R5>,
): (a: A1) => R5;

export function pipe(...fns: Array<(arg: any) => any>): (a: any) => any {
  return (arg) => fns.reduce((x, fn) => fn(x), arg);
}
