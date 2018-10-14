/**
 * Add two numbers
 * @param a a number
 * @param b a number
 *
 * @public
 */
export declare function add(a: number, b: number): number;
export declare function add(a: string, b: string): string;
export declare const SECRET_STRING = "shhhhh!";
/**
 * A vehicle is a thing that goes places
 */
declare class Vehicle {
    protected numWheels: number;
    /**
     * Create a new vehicle
     * @param {number} numWheels Number of wheels
     */
    constructor(numWheels: number);
    /**
     * Drive the vehicle
     * @returns {string}
     */
    drive(): string;
}
/**
 * A car is a 4-wheeled vehicle
 */
export declare class Car extends Vehicle {
    /**
     * Create a new car
     */
    constructor();
}
/**
 * A bike is a 2-wheeled vehicle
 */
export declare class Bike extends Vehicle {
    constructor();
}
/**
 * A Unicycle is a 1-wheeled vehicle
 */
export declare class Unicycle extends Vehicle {
    constructor();
}
export {};
