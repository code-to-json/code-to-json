import { AmdDependency } from 'typescript';
import { SerializedAmdDependency } from '../types/serialized-entities';

/**
 * Serialize a AmdDependency to a POJO
 * @param dep AmdDependency to serialize
 */
export default function serializeAmdDependency(dep: AmdDependency): SerializedAmdDependency {
  const { name, path } = dep;
  return { name, path };
}
