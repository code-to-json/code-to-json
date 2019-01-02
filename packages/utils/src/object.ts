export function conditionallyMergeTransformed<H extends {}, B, A extends H[K], K extends keyof H>(
  host: H,
  property: B | undefined,
  propertyName: K,
  transform: (b: B) => A,
  condition?: (prop: B) => boolean,
): void {
  if (property && (condition ? condition(property) : true)) {
    const x: Partial<Pick<H, K>> = {};
    /* eslint-disable no-param-reassign */
    host[propertyName] = transform(property);
  }
}
