import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import {
  DeclarationRef,
  isRef,
  NodeRef,
  SourceFileRef
} from '../processing-queue/ref';
import serializeAmdDependency, {
  SerializedAmdDependency
} from './amd-dependency';
import serializeDeclaration, { SerializedDeclaration } from './declaration';
import serializeFileReference, {
  SerializedFileReference
} from './file-reference';
import serializeNode, { SerializedNode } from './node';

export interface SerializedSourceFile
  extends Pick<
      SerializedDeclaration,
      Exclude<keyof SerializedDeclaration, 'thing'>
    > {
  thing: 'sourceFile';
  moduleName?: string;
  fileName?: string;
  statements?: NodeRef[];
  amdDependencies?: SerializedAmdDependency[];
  referencedFiles?: SerializedFileReference[];
  typeReferenceDirectives?: SerializedFileReference[];
  libReferenceDirectives?: SerializedFileReference[];
}

export default function serializeSourceFile(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  ref: SourceFileRef,
  _queue: ProcessingQueue
): SerializedSourceFile {
  const {
    fileName,
    moduleName,
    amdDependencies,
    statements: _statements,
    referencedFiles: _referencedFiles,
    typeReferenceDirectives: _typeReferenceDirectives,
    libReferenceDirectives: _libReferenceDirectives
  } = sourceFile;
  const referencedFiles = _referencedFiles.map(serializeFileReference);
  const typeReferenceDirectives = _typeReferenceDirectives.map(
    serializeFileReference
  );
  const libReferenceDirectives = _libReferenceDirectives.map(
    serializeFileReference
  );
  const statements = _statements
    .map((s) => _queue.queue(s, 'node', checker))
    .filter(isRef);
  const basicInfo: SerializedSourceFile = {
    ...serializeDeclaration(sourceFile, checker, ref, _queue),
    thing: 'sourceFile',
    fileName,
    moduleName,
    amdDependencies:
      amdDependencies && amdDependencies.map(serializeAmdDependency),
    statements,
    referencedFiles: referencedFiles.length > 0 ? referencedFiles : undefined,
    libReferenceDirectives:
      libReferenceDirectives.length > 0 ? libReferenceDirectives : undefined,
    typeReferenceDirectives:
      typeReferenceDirectives.length > 0 ? typeReferenceDirectives : undefined
  };
  /**
   * Take the source file's AST node, and use the checker
   * to obtain a Symbol (AST + Type Information, via the binder)
   */
  const sym = checker.getSymbolAtLocation(sourceFile);
  if (!sym) {
    // I don't know how we could ever get here, but would be a showstopper
    throw new Error(`No symbol for source file ${sourceFile.fileName}`);
  }
  /**
   * Obtain a reference for each source file's symbol.
   * Real analysis will happen later
   */
  return basicInfo;
}
