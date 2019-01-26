/* eslint-disable no-param-reassign */

import { CommentData } from '@code-to-json/comments';
import { setupTestCase } from '@code-to-json/test-helpers';
import { refId, refType } from '@code-to-json/utils';
import { nodeHost } from '@code-to-json/utils-node';
import { filterDict, mapDict, reduceDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import * as snapshot from 'snap-shot-it';
import { WalkerOutputData, walkProgram } from '../../src';
import {
  SerializedSourceFile,
  SerializedSymbol,
  SerializedType,
} from '../../src/types/serialized-entities';

interface TypeSummary {
  typeString: string;
  flags?: string[];
  objectFlags?: string[];
  libName?: string;
  documentation?: CommentData;
}

interface ExportSummary {
  name: string;
  type?: TypeSummary;
  documentation?: CommentData;
}

interface ExportSummaries {
  [k: string]: ExportSummary;
}

export const disableIf: (predicate: boolean) => ClassDecorator = predicate => target => {
  if (predicate) {
    Object.getOwnPropertyNames(target.prototype).forEach(methodName => {
      if (methodName === 'constructor') {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      target.prototype[methodName] = () => {
        expect(true).to.eq(true);
      };
    });
  }
};

function summarizeType(typ: SerializedType): TypeSummary {
  const { flags, objectFlags, libName, typeString, documentation } = typ;
  const out: TypeSummary = { flags, typeString };
  if (documentation) {
    out.documentation = documentation;
  }
  if (libName) {
    out.libName = libName;
  }
  if (objectFlags) {
    out.objectFlags = objectFlags;
  }
  return out;
}

export async function fullWalkerOutput(
  codeString: string,
): Promise<{ data: WalkerOutputData; cleanup: () => void; rootPath: string }> {
  const { program, cleanup, rootPath } = await setupTestCase(
    {
      // tslint:disable-next-line:no-duplicate-string
      src: { 'index.ts': codeString },
      'package.json': JSON.stringify({
        name: 'pkg-ts-single-file',
        'doc:main': 'src/index.ts',
      }),
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          target: 'es2017',
          moduleResolution: 'node',
          noEmit: true,
        },
        include: ['./src/**/*'],
      }),
    },
    ['src/index.ts'],
  );
  const walkerOutput = walkProgram(program, nodeHost);
  const { types, symbols, sourceFiles } = walkerOutput.data;

  Object.keys(types).forEach(k => {
    const t: SerializedType = types[k]!;
    if (t.typeString.includes(rootPath)) {
      t.typeString = t.typeString.replace(rootPath, '');
    }
  });
  Object.keys(symbols).forEach(k => {
    const s: SerializedSymbol = symbols[k]!;
    if (s.name.includes(rootPath)) {
      s.name = s.name.replace(rootPath, '');
    }
  });
  Object.keys(sourceFiles).forEach(k => {
    const s: SerializedSourceFile = sourceFiles[k]!;
    if (s.originalFileName && s.originalFileName.includes(rootPath)) {
      s.originalFileName = s.originalFileName.replace(rootPath, '');
    }
    if (s.moduleName && s.moduleName.includes(rootPath)) {
      s.moduleName = s.moduleName.replace(rootPath, '');
    }
    if (s.pathInPackage && s.pathInPackage.includes(rootPath)) {
      s.pathInPackage = s.pathInPackage.replace(rootPath, '');
    }
  });

  return { data: walkerOutput.data, cleanup, rootPath };
}
export async function exportedModuleSymbols(
  codeString: string,
): Promise<{ exports: ExportSummaries; cleanup: () => void }> {
  const { data, cleanup } = await fullWalkerOutput(codeString);

  const { symbols, sourceFiles, types } = data;

  const nonDeclarationFiles = filterDict(sourceFiles, f => !f.isDeclarationFile);
  const sourceFileKeys = Object.keys(nonDeclarationFiles);
  const sourceFileList = sourceFileKeys
    .map(sf => `"${nonDeclarationFiles[sf]!.originalFileName}"`)
    .join(', ');
  expect(sourceFileKeys).to.have.lengthOf(
    1,
    `one sourceFile should be found in walker output. Found: ${sourceFileList}`,
  );
  const [sourceFileKey] = sourceFileKeys;
  expect(sourceFileKey).to.be.a('string', 'nonDeclarationFiles keys should be strings');

  const sourceFile = nonDeclarationFiles[sourceFileKey];
  if (!sourceFile) {
    throw new Error('undefined sourceFile');
  }
  const { symbol: symbolRef } = sourceFile;
  if (!symbolRef) {
    throw new Error(`Expected SourceFile to have a symbol`);
  }
  expect(refType(symbolRef)).to.eql('symbol');
  const fileSymbolId = refId(symbolRef);
  expect(fileSymbolId)
    .to.be.a('string')
    .to.have.length.greaterThan(5);

  const fileSymbol = symbols[fileSymbolId];
  if (!fileSymbol) {
    throw new Error(`Expected fileSymbol to be defined`);
  }
  const { exports: exportList } = fileSymbol;
  if (!exportList || Object.keys(exportList).length === 0) {
    throw new Error('Expected file to have exports');
  }

  const exports = reduceDict(
    mapDict(exportList, exp => symbols[refId(exp)]),
    (summaries, exp) => {
      const { name, type: expTypeRef, documentation } = exp;
      const summary: ExportSummary = { name };
      if (documentation) {
        summary.documentation = documentation;
      }
      if (expTypeRef) {
        const typ = types[refId(expTypeRef)];
        if (!typ) {
          throw new Error(`Expected typ to be defined`);
        }
        summary.type = summarizeType(typ);
      }
      // eslint-disable-next-line no-param-reassign
      summaries[name] = summary;
      return summaries;
    },
    {} as ExportSummaries,
  );

  return { exports, cleanup };
}

function sanitizeType(
  type: SerializedType | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!type) {
    return;
  }
  replace.forEach(rep => {
    type.typeString = type.typeString.replace(rep[0], rep[1]);
  });
}

function sanitizeSourceFile(
  sourceFile: SerializedSourceFile | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!sourceFile) {
    return;
  }
  replace.forEach(rep => {
    if (sourceFile.name) {
      sourceFile.name = sourceFile.name.replace(rep[0], rep[1]);
    }
  });
}

function sanitizeSymbol(
  symbol: SerializedSymbol | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!symbol) {
    return;
  }
  replace.forEach(rep => {
    symbol.name = symbol.name.replace(rep[0], rep[1]);
    if (symbol.symbolString) {
      symbol.symbolString = symbol.symbolString.replace(rep[0], rep[1]);
    }
    if (symbol.typeString) {
      symbol.typeString = symbol.typeString.replace(rep[0], rep[1]);
    }
  });
}

export function sanitizedSnapshot(
  wo: Partial<WalkerOutputData>,
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
