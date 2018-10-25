import { SourceFile, TypeChecker } from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import { NodeRef, SourceFileRef, SymbolRef } from '../processing-queue/ref';
import serializeAmdDependency, { SerializedAmdDependency } from './amd-dependency';
import serializeDeclaration, { SerializedDeclaration } from './declaration';
import serializeFileReference, { SerializedFileReference } from './file-reference';

export interface SerializedSourceFile
  extends Pick<SerializedDeclaration, Exclude<keyof SerializedDeclaration, 'thing'>> {
  thing: 'sourceFile';
  moduleName?: string;
  fileName?: string;
  statements?: NodeRef[];
  symbol?: SymbolRef;
  isDeclarationFile: boolean;
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
    amdDependencies,
    isDeclarationFile,
    // statements,
    referencedFiles: _referencedFiles,
    typeReferenceDirectives: _typeReferenceDirectives,
    libReferenceDirectives: _libReferenceDirectives
  } = sourceFile;
  const referencedFiles = _referencedFiles.map(serializeFileReference);
  const typeReferenceDirectives = _typeReferenceDirectives.map(serializeFileReference);
  const libReferenceDirectives = _libReferenceDirectives.map(serializeFileReference);
  // tslint:disable-next-line:no-commented-code
  // const statements = _statements.map(s => _queue.queue(s, 'node', checker)).filter(isRef);
  const basicInfo: SerializedSourceFile = {
    ...serializeDeclaration(sourceFile, checker, ref, _queue),
    thing: 'sourceFile',
    fileName,
    moduleName,
    isDeclarationFile,
    amdDependencies: amdDependencies && amdDependencies.map(serializeAmdDependency),
    // statements,
    referencedFiles: referencedFiles.length > 0 ? referencedFiles : undefined,
    libReferenceDirectives: libReferenceDirectives.length > 0 ? libReferenceDirectives : undefined,
    typeReferenceDirectives:
      typeReferenceDirectives.length > 0 ? typeReferenceDirectives : undefined
  };
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
