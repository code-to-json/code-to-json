import { parseCommentString } from '@code-to-json/comments';
import { refId } from '@code-to-json/utils';
import * as ts from 'typescript';
import Collector from '../collector';
import { SourceFileRef } from '../types/ref';
import { SerializedSourceFile } from '../types/serialized-entities';
import serializeAmdDependency from './amd-dependency';
import serializeFileReference from './file-reference';

/**
 * Serialize a SourceFile to a POJO
 * @param sourceFile SourceFile to serialize
 * @param checker A type-checker
 * @param ref Refernece to the SourceFile being serialized
 * @param _queue Processing queue
 */
export default function serializeSourceFile(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  ref: SourceFileRef,
  c: Collector,
): SerializedSourceFile {
  const {
    fileName,
    isDeclarationFile,
    amdDependencies,
    referencedFiles: _referencedFiles,
    typeReferenceDirectives: _typeReferenceDirectives,
    libReferenceDirectives: _libReferenceDirectives,
    // statements: _statements
  } = sourceFile;
  const { moduleName, extension, relativePath } = c.pathNormalizer.filePathToModuleInfo(fileName);
  // tslint:disable-next-line:no-commented-code
  // const statements = _statements.map(s => _queue.queue(s, 'node', checker)).filter(isRef);

  const basicInfo: SerializedSourceFile = {
    id: refId(ref),
    entity: 'sourceFile',
    originalFileName: fileName,
    isDeclarationFile,
    moduleName,
    extension,
    pathInPackage: relativePath,
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
  const leadingComments = sourceFile.getFullText().substring(0, sourceFile.getLeadingTriviaWidth());
  const firstClose = leadingComments.indexOf('*/');
  const lastClose = leadingComments.lastIndexOf('*/');
  if (firstClose !== lastClose) {
    const leadingComment = `${leadingComments.split('*/')[0]}*/`;
    basicInfo.documentation = parseCommentString(leadingComment);
  }
  /**
   * Take the source file's AST node, and use the checker
   * to obtain a Symbol (AST + Type Information, via the binder)
   */
  const sym = checker.getSymbolAtLocation(sourceFile);
  if (sym) {
    basicInfo.symbol = c.queue.queue(sym, 'symbol', checker);
  }

  return basicInfo;
}
