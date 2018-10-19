import {
  flagsToString,
  isDeclaration,
  isNodeExported,
  isSymbol,
  isType,
  mapUem,
  UnreachableError
} from '@code-to-json/utils';
import * as ts from 'typescript';
import { create as createQueue, Ref } from './processing-queue';
import serializeDeclaration from './serializers/declaration';
import serializeSymbol from './serializers/symbol';
import serializeType from './serializers/type';
import { EntityMap } from './types';
// import WalkVisitor from './visitor';

/**
 * Walk a typescript program, using specified entry points, returning
 * JSON information describing the code
 */
export function walkProgram(program: ts.Program) {
  const checker = program.getTypeChecker();
  // const v = new WalkVisitor();
  const sourceFiles = program
    .getSourceFiles()
    .filter(f => !f.isDeclarationFile);
  const q = createQueue();
  sourceFiles.forEach(sf => {
    const sym = checker.getSymbolAtLocation(sf);
    if (!sym) {
      throw new Error(`No symbol for source file ${sf.fileName}`);
    }
    return q.queue(sym, 'symbol');
  });
  // const { types, declarations, symbols } = v.drainUntilDone(checker);
  // tslint:disable-next-line:no-debugger
  // const out = { files, types, declarations, symbols };
  // tslint:disable-next-line:no-console
  // console.log(JSON.stringify(out, null, '  '));
  const result = q.drain((ref, entity) => {
    const { id } = ref;
    if (isSymbol(entity)) {
      return serializeSymbol(
        entity,
        checker,
        ref as Ref<EntityMap, 'symbol'>,
        q
      );
    } else if (isType(entity)) {
      return serializeType(entity, checker, ref as Ref<EntityMap, 'type'>, q);
    } else if (isDeclaration(entity)) {
      return serializeDeclaration(
        entity,
        checker,
        ref as Ref<EntityMap, 'declaration'>,
        q
      );
    } else {
      if (!isNodeExported(entity)) {
        return;
      }
      debugger;
      throw new UnreachableError(entity, 'Unprocessable entity');
    }
  });
  console.log(JSON.stringify(result, null, '  '));
  return result;
}
