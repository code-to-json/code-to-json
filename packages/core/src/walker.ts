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
  SymbolRef,
  TypeRef
} from './processing-queue/ref';
import serializeDeclaration, {
  SerializedDeclaration
} from './serializers/declaration';
import serializeNode, { SerializedNode } from './serializers/node';
import serializeSymbol, { SerializedSymbol } from './serializers/symbol';
import serializeType, { SerializedType } from './serializers/type';

/**
 * Walk a typescript program, using specified entry points, returning
 * JSON information describing the code
 */
export function walkProgram(program: ts.Program) {
  // Create the type-checker
  const checker = program.getTypeChecker();

  // Get all non-declaration source files
  const sourceFiles = program
    .getSourceFiles()
    .filter((f) => !f.isDeclarationFile);

  // Initialize the work-processing queue
  const q = createQueue();
  sourceFiles.forEach((sf) => {
    /**
     * Take the source file's AST node, and use the checker
     * to obtain a Symbol (AST + Type Information, via the binder)
     */
    const sym = checker.getSymbolAtLocation(sf);
    if (!sym) {
      // I don't know how we could ever get here, but would be a showstopper
      throw new Error(`No symbol for source file ${sf.fileName}`);
    }
    /**
     * Obtain a reference for each source file's symbol.
     * Real analysis will happen later
     */
    return q.queue(sym, 'symbol', checker);
  });

  const result = q.drain({
    handleNode(ref: NodeRef, item: ts.Node) {
      // return serializeNode(item, checker, ref as NodeRef, q);
    },
    handleType(ref: TypeRef, item: ts.Type) {
      return serializeType(item, checker, ref as TypeRef, q);
    },
    handleSymbol(ref: SymbolRef, item: ts.Symbol) {
      return serializeSymbol(item, checker, ref as SymbolRef, q);
    },
    handleDeclaration(ref: DeclarationRef, item: ts.Declaration) {
      return serializeDeclaration(item, checker, ref, q);
    }
  });
  return result;
}
