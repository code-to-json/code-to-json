/**
 * Transform a value, and place it on an object under a specified property key,
 * if a prescribed condition is met
 *
 * @param host the object on which the transformed property may be placed
 * @param property the property to potentially transform
 * @param propertyName the property key of `host` where the transformed data may be placed
 * @param transform the transformation function
 * @param condition the condition
 *
 * @public
 */
export function conditionallyMergeTransformed<H extends {}, B, A extends H[K], K extends keyof H>(
  host: H,
  property: B | undefined,
  propertyName: K,
  transform: (b: B) => A,
  condition?: (prop: B) => boolean,
): void {
  if (property && (condition ? condition(property) : true)) {
    // eslint-disable-next-line no-param-reassign
    host[propertyName] = transform(property);
  }
}
