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
import serializeDeclaration from './serializers/declaration';
import serializeNode from './serializers/node';
import serializeSymbol from './serializers/symbol';
import serializeType from './serializers/type';

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

  const result = q.drain((ref, entity) => {
    if (isSymbol(entity)) {
      return serializeSymbol(entity, checker, ref as SymbolRef, q);
    } else if (isType(entity)) {
      return serializeType(entity, checker, ref as TypeRef, q);
    } else if (isDeclaration(entity)) {
      return serializeDeclaration(entity, checker, ref as DeclarationRef, q);
    } else if (isNode(entity)) {
      return serializeNode(entity, checker, ref as NodeRef, q);
    } else {
      throw new UnreachableError(entity, 'Unprocessable entity');
    }
  });
  return result;
}
