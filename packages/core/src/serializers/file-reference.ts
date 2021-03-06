import * as ts from 'typescript';
import { SerializedFileReference } from '../types/serialized-entities';

/**
 * Serialize a FileReference to a POJO
 * @param fr FileReference to serialize
 */
export default function serializeFileReference(fr: ts.FileReference): SerializedFileReference {
  return {
    name: fr.fileName,
  };
}
