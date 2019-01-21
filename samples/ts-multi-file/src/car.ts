import Vehicle from './vehicle';

/**
 * A car is a 4-wheeled vehicle
 */
export default class Car extends Vehicle<4> {
  /**
   * Create a new car
   */
  constructor() {
    super(4);
  }

  get wheelCount(): number {
    return this.numWheels;
  }
}
