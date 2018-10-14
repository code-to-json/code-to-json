/// <reference types="lodash"/>
import { Bike } from './cycles';
export function add(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
        return a + b;
    }
    else {
        return '' + a + b;
    }
}
export const SECRET_STRING = 'shhhhh!';
export { default as Car } from './car';
export { Unicycle, Bike } from './cycles';
class VehicleUtils {
    /**
     * Members
     */
    memberFn() {
        return '';
    }
}
(function (VehicleUtils) {
    /**
     * Create a new bike
     */
    function createBike() {
        return new Bike();
    }
    VehicleUtils.createBike = createBike;
})(VehicleUtils || (VehicleUtils = {}));
/**
 * The first bike
 */
export const firstBike = VehicleUtils.createBike();
function timeout(n) {
    return new Promise(resolve => setTimeout(resolve, n));
}
export const bikeSoon = timeout(3000).then(() => new Bike());
