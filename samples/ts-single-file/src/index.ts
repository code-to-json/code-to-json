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
 * @deprecated
 */
export function add(a: null, b: null): null;
/**
 * Concatenate two strings
 * @param a a string
 * @param b a string
 *
 * @example
 * add('foo', 'bar');
 *
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

/**
 * Could be a string or a number!
 */
export const x: string | number = Math.random() >= 0.5 ? 'foo' : 44;

/** a dictionary as type alias */
export type Dict<T extends string[]> = { [k: string]: T | undefined };

/** a dictionary as interface */
export interface IDict<T extends string[]> {
  [k: string]: T | undefined;
}

export const SECRET_STRING = 'shhhhh!';

class BasicObject {}

/**
 * A vehicle is a thing that goes places
 *
 * @author Mike
 */
class Vehicle extends BasicObject {
  protected numWheels: number;
  /**
   * Create a new vehicle
   * @param {number} numWheels Number of wheels
   */
  constructor(numWheels: number);
  /**
   * @deprecated
   * @param numWheels number of wheels
   */
  constructor(numWheels: string);
  constructor(numWheels: string | number) {
    super();
    if (typeof numWheels === 'string') this.numWheels = parseInt(numWheels, 10);
    else this.numWheels = numWheels;
  }
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
