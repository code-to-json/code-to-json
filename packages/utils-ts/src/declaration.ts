import * as ts from 'typescript';

export function isAbstractDeclaration(declaration: ts.Declaration): boolean {
  return !!declaration && !!(ts.getCombinedModifierFlags(declaration) & ts.ModifierFlags.Abstract);
}
