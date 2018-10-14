/**
 * A vehicle is a thing that goes places
 */
export default class Vehicle {
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
