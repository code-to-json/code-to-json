import * as ts from 'typescript';

export function isAbstractDeclaration(declaration: ts.Declaration): boolean {
  return !!declaration && !!(ts.getCombinedModifierFlags(declaration) & ts.ModifierFlags.Abstract);
}

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
