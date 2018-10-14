import { Bike } from './cycles';
export declare function add(a: number, b: number): number;
export declare function add(a: string, b: string): string;
export declare const SECRET_STRING = "shhhhh!";
export { default as Car } from './car';
export { Unicycle, Bike } from './cycles';
export { VehicleLike } from './types';
/**
 * The first bike
 */
export declare const firstBike: Bike;
export declare const bikeSoon: Promise<Bike>;
