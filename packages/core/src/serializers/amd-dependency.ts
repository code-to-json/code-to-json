import * as ts from 'typescript';
import { AmdDependency } from '../types/serialized-entities';

/**
 * Serialize a AmdDependency to a POJO
 * @param dep AmdDependency to serialize
 */
export default function serializeAmdDependency(dep: ts.AmdDependency): AmdDependency {
  const { name, path } = dep;
  return { name, path };
}
