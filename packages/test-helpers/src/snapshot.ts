/* eslint-disable no-param-reassign */
import { Dict } from '@mike-north/types';
import * as snapshot from 'snap-shot-it';

export interface WalkerOutputDataLike {
  symbols?: Dict<SymbolLike>;
  types?: Dict<TypeLike>;
  nodes?: Dict<Readonly<{}>>;
  declarations?: Dict<Readonly<{}>>;
  sourceFiles?: Dict<SourceFileLike>;
}

interface SymbolLike {
  name: string;
  typeString?: string;
  symbolString?: string;
}

interface TypeLike {
  typeString: string;
}

interface SourceFileLike {
  name?: string;
}

function sanitizeType(
  typeLike: TypeLike | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!typeLike) {
    return;
  }
  replace.forEach(rep => {
    typeLike.typeString = typeLike.typeString.replace(rep[0], rep[1]);
  });
}

function sanitizeSourceFile(
  sourceFileLike: SourceFileLike | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!sourceFileLike) {
    return;
  }
  replace.forEach(rep => {
    if (sourceFileLike.name) {
      sourceFileLike.name = sourceFileLike.name.replace(rep[0], rep[1]);
    }
  });
}

function sanitizeSymbol(
  symbolLike: SymbolLike | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!symbolLike) {
    return;
  }
  replace.forEach(rep => {
    symbolLike.name = symbolLike.name.replace(rep[0], rep[1]);
    if (symbolLike.symbolString) {
      symbolLike.symbolString = symbolLike.symbolString.replace(rep[0], rep[1]);
    }
    if (symbolLike.typeString) {
      symbolLike.typeString = symbolLike.typeString.replace(rep[0], rep[1]);
    }
  });
}

export function sanitizedWalkerOutputSnapshot(
  wo: WalkerOutputDataLike,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { symbols = {}, types = {}, sourceFiles = {} } = wo;
  for (const s in symbols) {
    if (symbols[s]) {
      sanitizeSymbol(symbols[s], options);
    }
  }
  for (const t in types) {
    if (types[t]) {
      sanitizeType(types[t], options);
    }
  }
  for (const sf in sourceFiles) {
    if (sourceFiles[sf]) {
      sanitizeSourceFile(sourceFiles[sf], options);
    }
  }
  snapshot(wo);
}
