import { getLineAndCharacterOfPosition, SourceFile } from 'typescript';
import { CodeRange } from '../types/serialized-entities';

export default function serializeLocation(
  sourceFile: SourceFile,
  pos: number,
  end: number,
): CodeRange {
  const posStart = getLineAndCharacterOfPosition(sourceFile, pos + 1);
  const posEnd = getLineAndCharacterOfPosition(sourceFile, end);
  return [
    sourceFile.fileName,
    posStart.line + 1,
    posStart.character,
    posEnd.line + 1,
    posEnd.character,
  ];
}
