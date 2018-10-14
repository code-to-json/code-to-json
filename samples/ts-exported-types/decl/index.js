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
