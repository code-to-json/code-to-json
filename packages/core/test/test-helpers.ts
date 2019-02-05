/* eslint-disable import/prefer-default-export */
import * as ts from 'typescript';

export function getDeclarationFiles(
  sourceFiles: ReadonlyArray<ts.SourceFile>,
): {
  declarationFiles: ts.SourceFile[];
  nonDeclarationFiles: ts.SourceFile[];
  tsLibNames: string[];
  tsLibs: ts.SourceFile[];
} {
  const declarationFiles = sourceFiles.filter((sf) => sf.isDeclarationFile);
  const nonDeclarationFiles = sourceFiles.filter((sf) => !sf.isDeclarationFile);
  const tsLibs = declarationFiles.filter(
    (sf) => sf.fileName.indexOf('node_modules/typescript/lib') > 0,
  );
  const tsLibNames = tsLibs.map(
    (sf) =>
      `${sf.fileName.substring(
        sf.fileName.lastIndexOf('typescript/lib/') + 'typescript/lib/'.length,
      )}`,
  );
  return { declarationFiles, nonDeclarationFiles, tsLibNames, tsLibs };
}
