/* eslint-disable no-param-reassign */

import { SerializedSourceFile, SerializedSymbol, SerializedType } from '../../../src';

export function sanitizeType(
  type: SerializedType | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!type) {
    return;
  }
  replace.forEach((rep) => {
    type.text = type.text.replace(rep[0], rep[1]);
  });
}

export function sanitizeSourceFile(
  sourceFile: SerializedSourceFile | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!sourceFile) {
    return;
  }
  replace.forEach((rep) => {
    if (sourceFile.name) {
      sourceFile.name = sourceFile.name.replace(rep[0], rep[1]);
    }
    if (sourceFile.originalFileName) {
      sourceFile.originalFileName = sourceFile.originalFileName.replace(rep[0], rep[1]);
    }
    sourceFile.moduleName = sourceFile.moduleName.replace(rep[0], rep[1]);
    sourceFile.pathInPackage = sourceFile.pathInPackage.replace(rep[0], rep[1]);
  });
}

export function sanitizeSymbol(
  symbol: SerializedSymbol | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!symbol) {
    return;
  }
  replace.forEach((rep) => {
    symbol.name = symbol.name.replace(rep[0], rep[1]);
    symbol.text = symbol.text.replace(rep[0], rep[1]);
  });
}
