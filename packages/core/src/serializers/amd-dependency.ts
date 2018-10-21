import { AmdDependency } from 'typescript';

export interface SerializedAmdDependency {
  name?: string;
  path: string;
}

export default function serializeAmdDependency(
  dep: AmdDependency
): SerializedAmdDependency {
  const { name, path } = dep;
  return { name, path };
}
