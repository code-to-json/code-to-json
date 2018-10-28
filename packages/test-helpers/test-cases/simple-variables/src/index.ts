/**
 * This is a variable with an explicit type
 */
const constWithExplicitType: string = 'foo';
/**
 * This is a variable might be undefined
 */
const constMaybeUndefined: string | undefined = 'foo';
/**
 * This is a variable might be undefined, and is also reassignable;
 */
let letMaybeUndefined: string | undefined;
letMaybeUndefined = 'foo';
/**
 * This is a variable with an implicit type
 */
const constWithImplicitType = 'foo';
