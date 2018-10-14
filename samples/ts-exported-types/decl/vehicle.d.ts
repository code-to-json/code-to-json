import { VehicleLike, VehicleFactory } from './types';
/**
 * A vehicle is a thing that goes places
 */
export default class Vehicle implements VehicleLike {
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
export declare const Factory4: VehicleFactory<4>;
