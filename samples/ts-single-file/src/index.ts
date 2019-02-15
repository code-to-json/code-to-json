// tslint:disable:max-classes-per-file

/**
 * Add two numbers
 * @param a a number
 * @param b a number
 *
 * @public
 */
export function add(a: number, b: number): number;
/**
 * Concatenate two strings
 * @param a a string
 * @param b a string
 *
 * @public
 */
export function add(a: string, b: string): string;
export function add(a: number | string, b: number | string): number | string {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  } else {
    return '' + a + b;
  }
}

export type Dict<T extends string[]> = { [k: string]: T | undefined };

export const SECRET_STRING = 'shhhhh!';

/**
 * A vehicle is a thing that goes places
 */
class Vehicle {
  /**
   * Create a new vehicle
   * @param {number} numWheels Number of wheels
   */
  constructor(protected numWheels: number) {}
  /**
   * Drive the vehicle
   * @returns {string}
   */
  public drive(): string {
    return `Driving with all ${this.numWheels} wheels`;
  }
  /**
   * Drive the vehicle in reverse
   * @returns {string} foo
   */
  protected reverse(): string {
    return `Reversing with all ${this.numWheels} wheels`;
  }
}

export interface HasRegistration {
  registration: number;
}
export interface HasVin extends HasRegistration {
  vin: number;
}

/**
 * A car is a 4-wheeled vehicle
 */
export class Car extends Vehicle implements HasVin {
  /**
   * Create a new car
   */
  constructor() {
    super(4);
  }
  registration = 41;
  vin = 99;
}

/**
 * A bike is a 2-wheeled vehicle
 */
export class Bike extends Vehicle {
  constructor() {
    super(2);
  }
}

/**
 * A Unicycle is a 1-wheeled vehicle
 */
export default class Unicycle extends Vehicle {
  constructor() {
    super(1);
  }
}
