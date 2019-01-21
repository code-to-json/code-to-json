import * as ts from 'typescript';

export function isErroredType(type: ts.Type): boolean {
  return !!(type.flags & ts.TypeFlags.Any) && (type as any).intrinsicName === 'error';
}
