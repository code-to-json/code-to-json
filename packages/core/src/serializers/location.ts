import * as ts from 'typescript';
import { Queue } from '../processing-queue';
import { CodeRange } from '../types/serialized-entities';

/**
 * Serialize a code range in a SourceFile
 *
 * @param sourceFile source file in which the code range exists
 * @param pos beginning location
 * @param end end location
 * @param q processing queue
 */
export default function serializeLocation(
  sourceFile: ts.SourceFile,
  pos: number,
  end: number,
  q: Queue,
): CodeRange {
  const posStart = ts.getLineAndCharacterOfPosition(sourceFile, pos + 1);
  const posEnd = ts.getLineAndCharacterOfPosition(sourceFile, end);
  const sourceFileRef = q.queue(sourceFile, 'sourceFile');
  if (!sourceFileRef) {
    throw new Error(`Unable to create a reference for SourceFile ${sourceFile.fileName}`);
  }
  return [sourceFileRef, posStart.line + 1, posStart.character, posEnd.line + 1, posEnd.character];
}
