import { CommentData, parseCommentString } from '@code-to-json/comments';
import { refId } from '@code-to-json/utils';
import { Dict } from '@mike-north/types';
import * as ts from 'typescript';
import { SourceFileRef } from '../types/ref';
import { SerializedSourceFile } from '../types/serialized-entities';
import { Collector } from '../types/walker';
import serializeAmdDependency from './amd-dependency';
import serializeFileReference from './file-reference';

/**
 * Extract and serialize any ts.FileReferences that may be present on a ts.SourceFile
 *
 * @param fileReferences
 */
function serializeFileReferences(
  fileReferences: Dict<ReadonlyArray<ts.FileReference>>,
): Pick<
  SerializedSourceFile,
  'referencedFiles' | 'typeReferenceDirectives' | 'libReferenceDirectives'
> {
  const {
    referencedFileRefs,
    typeReferenceDirectiveRefs,
    libReferenceDirectiveRefs,
  } = fileReferences;
  const out: Pick<
    SerializedSourceFile,
    'referencedFiles' | 'typeReferenceDirectives' | 'libReferenceDirectives'
  > = {};

  if (referencedFileRefs && referencedFileRefs.length > 0) {
    out.referencedFiles = referencedFileRefs.map(serializeFileReference);
  }
  if (typeReferenceDirectiveRefs && typeReferenceDirectiveRefs.length > 0) {
    out.referencedFiles = typeReferenceDirectiveRefs.map(serializeFileReference);
  }
  if (libReferenceDirectiveRefs && libReferenceDirectiveRefs.length > 0) {
    out.referencedFiles = libReferenceDirectiveRefs.map(serializeFileReference);
  }
  return out;
}

/**
 * Extract any documentation that may be present at the top of a ts.SourceFile, but not
 * intended to relate to a partiuclar declaration within the file
 *
 * @param sourceFile
 */
function serializeFileDocumentation(sourceFile: ts.SourceFile): { documentation?: CommentData } {
  const out: { documentation?: CommentData } = {};
  const leadingComments = sourceFile.getFullText().substring(0, sourceFile.getLeadingTriviaWidth());
  const firstClose = leadingComments.indexOf('*/');
  const lastClose = leadingComments.lastIndexOf('*/');
  if (firstClose !== lastClose) {
    const leadingComment = `${leadingComments.split('*/')[0]}*/`;
    out.documentation = parseCommentString(leadingComment);
  }
  return out;
}

/**
 * Serialize a SourceFile to a JSON object
 *
 * @param sourceFile SourceFile to serialize
 * @param checker A type-checker
 * @param ref Refernece to the SourceFile being serialized
 * @param c walker collector
 */
export default function serializeSourceFile(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  ref: SourceFileRef,
  c: Collector,
): SerializedSourceFile {
  const {
    fileName: originalFileName,
    isDeclarationFile,
    amdDependencies,
    referencedFiles: referencedFileRefs,
    typeReferenceDirectives: typeReferenceDirectiveRefs,
    libReferenceDirectives: libReferenceDirectiveRefs,
  } = sourceFile;
  const {
    moduleName,
    extension,
    relativePath: pathInPackage,
  } = c.cfg.pathNormalizer.filePathToModuleInfo(originalFileName);

  const basicInfo: SerializedSourceFile = {
    id: refId(ref),
    entity: 'sourceFile',
    originalFileName,
    isDeclarationFile,
    moduleName,
    extension,
    pathInPackage,
  };

  // deal with any AMD dependencies
  if (amdDependencies && amdDependencies.length > 0) {
    basicInfo.amdDependencies = amdDependencies.map(serializeAmdDependency);
  }

  Object.assign(
    basicInfo,
    // Put any file references into place
    serializeFileReferences({
      referencedFileRefs,
      typeReferenceDirectiveRefs,
      libReferenceDirectiveRefs,
    }),
    // Put any documentation into place
    serializeFileDocumentation(sourceFile),
  );

  /**
   * Take the source file's AST node, and use the checker
   * to obtain a Symbol (AST + Type Information, via the binder)
   */
  const sym = checker.getSymbolAtLocation(sourceFile);
  if (sym) {
    basicInfo.symbol = c.queue.queue(sym, 'symbol');
  }

  return basicInfo;
}
