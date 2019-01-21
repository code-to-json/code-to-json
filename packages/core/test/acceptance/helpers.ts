import { CommentData } from '@code-to-json/comments';
import { setupTestCase } from '@code-to-json/test-helpers';
import { refId, refType } from '@code-to-json/utils';
import { nodeHost } from '@code-to-json/utils-node';
import { filterDict, mapDict, reduceDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { walkProgram } from '../../src';
import { SerializedType } from '../../src/types/serialized-entities';

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

export async function exportedModuleSymbols(
  codeString: string,
): Promise<{ exports: ExportSummaries; cleanup: () => void }> {
  const { program, cleanup } = await setupTestCase(
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

  const {
    data: { symbols, sourceFiles, types },
  } = walkerOutput;

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
