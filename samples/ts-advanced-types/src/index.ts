/// <reference types="lodash"/>

import { Bike } from './cycles';

export function add(a: number, b: number): number;
export function add(a: string, b: string): string;
export function add(a: number | string, b: number | string): number | string {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  } else {
    return '' + a + b;
  }
}

export const SECRET_STRING = 'shhhhh!';

export { default as Car } from './car';
export { Unicycle, Bike } from './cycles';
export { VehicleLike } from './types';

/**
 * Utilities for working with vehicles
 *
 * @example
 * ```ts
 * const x = VehicleUtils.description;
 * ```
 * @private
 * @see Vehicle
 * @author Mike North
 */
export class VehicleUtils {
  /**
   * Static things
   */
  public static description: 'Utilities for vehicles';
  /**
   * Members
   */
  public memberFn() {
    return '';
  }
  protected protectedFn() {
    return '';
  }
  protected privateFn<T extends 'foo' | 'bar'>(arg: T) {
    return `${arg}, baz`;
  }
}

namespace VehicleUtils {
  /**
   * Create a new bike
   */
  export function createBike(): Bike {
    return new Bike();
  }
}

/**
 * The first bike
 */
export const firstBike = VehicleUtils.createBike();

function timeout(n: number) {
  return new Promise<void>(resolve => setTimeout(resolve, n));
}

export const bikeSoon = timeout(3000).then(() => new Bike());
