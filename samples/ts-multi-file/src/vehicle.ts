/**
 * A vehicle is a thing that goes places
 */
export default class Vehicle<N extends number> {
  /**
   * Create a new vehicle
   * @param numWheels Number of wheels
   */
  constructor(protected numWheels: N) {}
  /**
   * Drive the vehicle
   * @returns {string}
   */
  drive() {
    return `Driving with all ${this.numWheels} wheels`;
  }
}
