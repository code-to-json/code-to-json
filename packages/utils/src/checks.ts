function get(obj: any, propname: string) {
  if (obj && typeof obj === 'object') return obj[propname];
  else return undefined;
}

export function isEmpty(obj: any): boolean {
  let none = obj === null || obj === undefined;
  if (none) {
    return none;
  }

  if (typeof obj.size === 'number') {
    return !obj.size;
  }

  let objectType = typeof obj;

  if (objectType === 'object') {
    let size = get(obj, 'size');
    if (typeof size === 'number') {
      return !size;
    }
  }

  if (typeof obj.length === 'number' && objectType !== 'function') {
    return !obj.length;
  }

  if (objectType === 'object') {
    let length = get(obj, 'length');
    if (typeof length === 'number') {
      return !length;
    }
  }

  return false;
}

export function isBlank(obj: any): boolean {
  return isEmpty(obj) || (typeof obj === 'string' && /\S/.test(obj) === false);
}

export function isPresent(obj: object): any {
  return !isBlank(obj);
}
