export function isArray(value: any): value is any[] {
  return value instanceof Array;
}

export function isHomogenousArray<T>(
  value: any,
  validator: (v: any) => v is T
): value is T[] {
  if (!isArray(value)) return false;
  for (let i = 0; i < value.length; i++) {
    if (!validator(value[i])) return false;
  }
  return true;
}
