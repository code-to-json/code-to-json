import * as ts from 'typescript';
import { WalkData, SerializedType } from '../types';
import serializeBaseNode from './base';
import { flagsToString } from '@code-to-json/utils';

export default function serializeType(
  typ: ts.Type,
  checker: ts.TypeChecker,
  walkData: WalkData
): SerializedType {
  const id = (typ as any).id;
  if (walkData.typeRegistry[id]) return walkData.typeRegistry[id];
  return (walkData.typeRegistry[id] = {
    id: (typ as any).id,
    text: checker.typeToString(typ),
    flags: flagsToString(typ.flags, ts.TypeFlags as any)
  });
}
