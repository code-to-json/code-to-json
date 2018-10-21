import {
  isDeclaration,
  isNode,
  isSymbol,
  isType,
  UnreachableError
} from '@code-to-json/utils';
import * as ts from 'typescript';
import { create as createQueue } from './processing-queue';
import {
  DeclarationRef,
  NodeRef,
  SourceFileRef,
  SymbolRef,
  TypeRef
} from './processing-queue/ref';
import serializeDeclaration, {
  SerializedDeclaration
} from './serializers/declaration';
import serializeNode, { SerializedNode } from './serializers/node';
import serializeSourceFile, {
  SerializedSourceFile
} from './serializers/source-file';
import serializeSymbol, { SerializedSymbol } from './serializers/symbol';
import serializeType, { SerializedType } from './serializers/type';

/**
 * Walk a typescript program, using specified entry points, returning
 * JSON information describing the code
 */
export function walkProgram(program: ts.Program): any {
  // Create the type-checker
  const checker = program.getTypeChecker();

  // Get all non-declaration source files
  const sourceFiles = program
    .getSourceFiles()
    .filter((f) => !f.isDeclarationFile);

  // Initialize the work-processing queue
  const q = createQueue();
  sourceFiles.forEach((sf) => {
    return q.queue(sf, 'sourceFile', checker);
  });

  const result = q.drain({
    handleNode(ref: NodeRef, item: ts.Node): SerializedNode {
      return serializeNode(item, checker, ref as NodeRef, q);
    },
    handleType(ref: TypeRef, item: ts.Type): SerializedType {
      return serializeType(item, checker, ref as TypeRef, q);
    },
    handleSourceFile(
      ref: SourceFileRef,
      item: ts.SourceFile
    ): SerializedSourceFile {
      return serializeSourceFile(item, checker, ref as SourceFileRef, q);
    },
    handleSymbol(ref: SymbolRef, item: ts.Symbol): SerializedSymbol {
      return serializeSymbol(item, checker, ref as SymbolRef, q);
    },
    handleDeclaration(
      ref: DeclarationRef,
      item: ts.Declaration
    ): SerializedDeclaration {
      return serializeDeclaration(item, checker, ref, q);
    }
  });
  return result;
}
