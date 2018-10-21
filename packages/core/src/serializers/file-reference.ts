import { FileReference } from 'typescript';
import serializePosition, { SerializedPosition } from './position';

export interface SerializedFileReference extends SerializedPosition {
  name?: string;
}

/**
 * Serialize a FileReference to a POJO
 * @param fr FileReference to serialize
 */
export default function serializeFileReference(fr: FileReference): SerializedFileReference {
  return {
    name: fr.fileName,
    ...serializePosition(fr)
  };
}
