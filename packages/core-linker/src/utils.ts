export function pruneUndefinedValues(o: any): any {
  for (const k in o) {
    if (Object.prototype.hasOwnProperty.call(o, k) && typeof o[k] === 'undefined') {
      // eslint-disable-next-line no-param-reassign
      delete o[k];
    }
  }
  return o;
}
