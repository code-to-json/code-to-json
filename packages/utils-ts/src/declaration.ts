import * as ts from 'typescript';

/**
 * Check whether a declaration is abstract
 *
 * @param declaration declaration to check
 *
 * @public
 */
export function isAbstractDeclaration(declaration: ts.Declaration): boolean {
  return !!declaration && !!(ts.getCombinedModifierFlags(declaration) & ts.ModifierFlags.Abstract);
}

/**
 * Check whether a declaration is visible outside its respective file
 * @param declaration Declaration to check
 *
 * @public
 */
export function isDeclarationExported(declaration: ts.Declaration): boolean {
  return (
    (ts.getCombinedModifierFlags(declaration) & ts.ModifierFlags.Export) !== 0 ||
    (!!declaration.parent && declaration.parent.kind === ts.SyntaxKind.SourceFile)
  );
}
