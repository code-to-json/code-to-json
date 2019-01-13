import { FileReference } from 'typescript';
import { CodeRange, SerializedFileReference } from '../types';

/**
 * Serialize a FileReference to a POJO
 * @param fr FileReference to serialize
 */
export default function serializeFileReference(fr: FileReference): SerializedFileReference {
  return {
    name: fr.fileName,
  };
}
