/* eslint-disable no-param-reassign */

import { FormattedSourceFile, FormattedSymbol, FormattedType } from '../../../src';

export function sanitizeFormattedSymbol(
  symbol: FormattedSymbol | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!symbol) {
    return;
  }
  replace.forEach((rep) => {
    symbol.name = symbol.name.replace(rep[0], rep[1]);
    if (symbol.text) {
      symbol.text = symbol.text.replace(rep[0], rep[1]);
    }
  });
}

export function sanitizeFormattedType(
  type: FormattedType | undefined,
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

export function sanitizeFormattedSourceFile(
  type: FormattedSourceFile | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!type) {
    return;
  }
  replace.forEach((rep) => {
    if (type.moduleName) {
      type.moduleName = type.moduleName.replace(rep[0], rep[1]);
    }
    type.path = type.path.replace(rep[0], rep[1]);
    type.path = type.path.replace(rep[0], rep[1]);
  });
}
