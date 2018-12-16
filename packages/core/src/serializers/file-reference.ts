import { FileReference } from 'typescript';
import { CodeRange } from '../types';

export interface SerializedFileReference {
  name?: string;
  location?: CodeRange;
}

/**
 * Serialize a FileReference to a POJO
 * @param fr FileReference to serialize
 */
export default function serializeFileReference(fr: FileReference): SerializedFileReference {
  return {
    name: fr.fileName,
  };
}
