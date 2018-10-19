import {
  isDeclaration,
  isNodeExported,
  isSymbol,
  isType,
  UnreachableError
} from '@code-to-json/utils';
import * as ts from 'typescript';
import { create as createQueue } from './processing-queue';
import Ref from './processing-queue/ref';
import serializeDeclaration from './serializers/declaration';
import serializeSymbol from './serializers/symbol';
import serializeType from './serializers/type';

/**
 * Walk a typescript program, using specified entry points, returning
 * JSON information describing the code
 */
export function walkProgram(program: ts.Program) {
  const checker = program.getTypeChecker();
  const sourceFiles = program
    .getSourceFiles()
    .filter((f) => !f.isDeclarationFile);
  const q = createQueue();
  sourceFiles.forEach((sf) => {
    const sym = checker.getSymbolAtLocation(sf);
    if (!sym) {
      throw new Error(`No symbol for source file ${sf.fileName}`);
    }
    return q.queue(sym, 'symbol');
  });

  const result = q.drain((ref, entity) => {
    if (isSymbol(entity)) {
      return serializeSymbol(entity, checker, ref as Ref<'symbol'>, q);
    } else if (isType(entity)) {
      return serializeType(entity, checker, ref as Ref<'type'>, q);
    } else if (isDeclaration(entity)) {
      return serializeDeclaration(
        entity,
        checker,
        ref as Ref<'declaration'>,
        q
      );
    } else {
      if (!isNodeExported(entity)) {
        debugger;
        return;
      }
      debugger;
      throw new UnreachableError(entity, 'Unprocessable entity');
    }
  });
  // tslint:disable-next-line:no-console
  console.log(JSON.stringify(result, null, '  '));
  return result;
}
