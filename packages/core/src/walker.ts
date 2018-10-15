import * as ts from 'typescript';
import serializeNode from './serializers/node';
import { WalkData } from './types';

/**
 * Walk a typescript program, using specified entry points, returning
 * JSON information describing the code
 */
export function walkProgram(program: ts.Program) {
  const checker = program.getTypeChecker();
  const walkData: WalkData = {
    typeRegistry: {}
  };
  const files = program
    .getSourceFiles()
    .filter(f => !f.isDeclarationFile)
    .map(f => serializeNode(f, checker, walkData));
  const out = { files, types: walkData.typeRegistry };
  // console.log(JSON.stringify(out, null, '  '));
  return out;
}
