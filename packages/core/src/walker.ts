import { isDeclaration, mapChildren } from '@code-to-json/utils';
import * as ts from 'typescript';
import serializeClass from './serializers/class';
import serializeFunction from './serializers/function';
import { WalkData } from './types';

/** True if this is visible outside this file, false otherwise */
function isNodeExported(node: ts.Declaration): boolean {
  return (
    // tslint:disable-next-line:no-bitwise
    (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}

/**
 * Walk a typescript program, using specified entry points, returning
 * JSON information describing the code
 */
export function walkProgram(program: ts.Program) {
  const checker = program.getTypeChecker();
  const walkData: WalkData = {
    typeRegistry: {},
    output: []
  };
  const sourceFiles = program
    .getSourceFiles()
    .filter((f) => !f.isDeclarationFile);

  sourceFiles.map((sf) => {
    return {
      name: sf.fileName,
      children: mapChildren(sf, (child) => {
        visit(child, checker, walkData);
      })
    };
  });
  const out = { files: walkData.output, types: walkData.typeRegistry };
  // tslint:disable-next-line:no-console
  console.log(JSON.stringify(out, null, '  '));
  return out;
}

function visit(node: ts.Node, checker: ts.TypeChecker, walkData: WalkData) {
  // Only consider exported nodes
  if (!isDeclaration(node) || !isNodeExported(node)) {
    return;
  }

  if (ts.isClassDeclaration(node) && node.name) {
    // This is a top level class, get its symbol
    const symbol = checker.getSymbolAtLocation(node.name);
    if (symbol) {
      walkData.output.push(serializeClass(symbol, checker));
    }
    // No need to walk any further, class expressions/inner declarations
    // cannot be exported
  } else if (ts.isFunctionDeclaration(node) && node.name) {
    // This is a top level function, get its symbol
    const symbol = checker.getSymbolAtLocation(node.name);
    if (symbol) {
      walkData.output.push(serializeFunction(symbol, checker));
    }
  } else if (ts.isModuleDeclaration(node)) {
    // This is a namespace, visit its children
    ts.forEachChild(node, (n) => visit(n, checker, walkData));
  } else {
    // tslint:disable-next-line:no-console
    console.error(`We don't yet handle nodes like this
${node.getText()}`);
  }
}
