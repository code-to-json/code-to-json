/* eslint-disable import/prefer-default-export, no-bitwise */
import * as ts from 'typescript';

/**
 * Check whether a declaration is visible outside its respective file
 * @param declaration Declaration to check
 */
export function isDeclarationExported(declaration: ts.Declaration): boolean {
  return (
    // tslint:disable-next-line:no-bitwise
    (ts.getCombinedModifierFlags(declaration) & ts.ModifierFlags.Export) !== 0 ||
    (!!declaration.parent && declaration.parent.kind === ts.SyntaxKind.SourceFile)
  );
}
