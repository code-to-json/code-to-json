import * as ts from 'typescript';

const MODIFIERS_MAP: { [k: string]: string } = {
  AbstractKeyword: 'abstract',
  AsyncKeyword: 'async',
  ConstKeyword: 'const',
  DeclareKeyword: 'declare',
  DefaultKeyword: 'default',
  ExportKeyword: 'export',
  PublicKeyword: 'public',
  PrivateKeyword: 'private',
  ProtectedKeyword: 'protected',
  ReadonlyKeyword: 'readonly',
  StaticKeyword: 'static',
};

export function modifiersToStrings(modifiers: ts.NodeArray<ts.Modifier>): string[] {
  return modifiers.map(m => {
    const mName = ts.SyntaxKind[m.kind];
    return MODIFIERS_MAP[mName] || mName;
  });
}
