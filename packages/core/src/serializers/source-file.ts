import { refId } from '@code-to-json/utils';
import { SourceFile, TypeChecker } from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import { NodeRef, SourceFileRef, SymbolRef } from '../processing-queue/ref';
import { SerializedEntity } from '../types';
import serializeAmdDependency, { SerializedAmdDependency } from './amd-dependency';
import serializeFileReference, { SerializedFileReference } from './file-reference';

export interface SerializedSourceFile extends SerializedEntity<'sourceFile'> {
  fileName?: string;
  isDeclarationFile: boolean;
  moduleName?: string;
  statements?: NodeRef[];
  symbol?: SymbolRef;
  amdDependencies?: SerializedAmdDependency[];
  referencedFiles?: SerializedFileReference[];
  typeReferenceDirectives?: SerializedFileReference[];
  libReferenceDirectives?: SerializedFileReference[];
}
/**
 * Serialize a SourceFile to a POJO
 * @param sourceFile SourceFile to serialize
 * @param checker A type-checker
 * @param ref Refernece to the SourceFile being serialized
 * @param _queue Processing queue
 */
export default function serializeSourceFile(
  sourceFile: SourceFile,
  checker: TypeChecker,
  ref: SourceFileRef,
  _queue: ProcessingQueue
): SerializedSourceFile {
  const {
    fileName,
    moduleName,
    isDeclarationFile,
    amdDependencies,
    referencedFiles: _referencedFiles,
    typeReferenceDirectives: _typeReferenceDirectives,
    libReferenceDirectives: _libReferenceDirectives
    // statements: _statements
  } = sourceFile;

  // tslint:disable-next-line:no-commented-code
  // const statements = _statements.map(s => _queue.queue(s, 'node', checker)).filter(isRef);
  const basicInfo: SerializedSourceFile = {
    id: refId(ref),
    entity: 'sourceFile',
    moduleName,
    fileName,
    isDeclarationFile
    // statements
  };
  if (amdDependencies && amdDependencies.length > 0) {
    basicInfo.amdDependencies = amdDependencies.map(serializeAmdDependency);
  }
  if (_referencedFiles && _referencedFiles.length > 0) {
    basicInfo.referencedFiles = _referencedFiles.map(serializeFileReference);
  }
  if (_typeReferenceDirectives && _typeReferenceDirectives.length > 0) {
    basicInfo.referencedFiles = _typeReferenceDirectives.map(serializeFileReference);
  }
  if (_libReferenceDirectives && _libReferenceDirectives.length > 0) {
    basicInfo.referencedFiles = _libReferenceDirectives.map(serializeFileReference);
  }

  /**
   * Take the source file's AST node, and use the checker
   * to obtain a Symbol (AST + Type Information, via the binder)
   */
  const sym = checker.getSymbolAtLocation(sourceFile);
  if (sym) {
    basicInfo.symbol = _queue.queue(sym, 'symbol', checker);
  }
  return basicInfo;
}
