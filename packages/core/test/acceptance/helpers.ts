import { setupTestCase } from '@code-to-json/test-helpers';
import { refId, refType } from '@code-to-json/utils';
import { nodeHost } from '@code-to-json/utils-node';
import { expect } from 'chai';
import { walkProgram } from '../../src';
import {
  SerializedBuiltInType,
  SerializedCoreType,
  SerializedCustomType,
  SerializedType,
} from '../../src/types';

interface TypeSummary {
  typeString: string;
  flags?: string[];
  objectFlags?: string[];
  libName?: string;
  typeKind: string;
}

interface ExportSummary {
  name: string;
  type?: TypeSummary;
}

interface ExportSummaries {
  [k: string]: ExportSummary;
}

function summarizeCoreType(typ: SerializedCoreType): TypeSummary {
  const { flags, typeString, objectFlags, typeKind } = typ;
  const toReturn: TypeSummary = { typeString, flags, typeKind };
  if (objectFlags) {
    toReturn.objectFlags = objectFlags;
  }
  return toReturn;
}
function summarizeBuiltInType(typ: SerializedBuiltInType): TypeSummary {
  const { flags, typeString, libName, objectFlags, typeKind } = typ;
  const toReturn: TypeSummary = { typeString, flags, libName, typeKind };
  if (objectFlags) {
    toReturn.objectFlags = objectFlags;
  }
  return toReturn;
}

// tslint:disable-next-line:no-identical-functions
function summarizeCustomType(typ: SerializedCustomType): TypeSummary {
  const { flags, typeString, objectFlags, typeKind } = typ;
  const toReturn: TypeSummary = { typeString, flags, typeKind };
  if (objectFlags) {
    toReturn.objectFlags = objectFlags;
  }
  return toReturn;
}

function summarizeType(typ: SerializedType): TypeSummary {
  switch (typ.typeKind) {
    case 'built-in':
      return summarizeBuiltInType(typ);
    case 'core':
      return summarizeCoreType(typ);
    case 'custom':
      return summarizeCustomType(typ);
    default:
      throw new Error(`Unknown typeKind value: ${JSON.stringify(typ)}`);
  }
}

export async function singleExportModuleExports(
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

  const sourceFileKeys = Object.keys(sourceFiles);
  expect(sourceFileKeys).to.have.lengthOf(1, 'one sourceFile should be found in walker output');
  const [sourceFileKey] = sourceFileKeys;
  expect(sourceFileKey).to.be.a('string', 'sourceFiles keys should be strings');

  const sourceFile = sourceFiles[sourceFileKey];
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

  const { exports: exportList } = fileSymbol;
  if (!exportList || exportList.length === 0) {
    throw new Error('Expected file to have exports');
  }

  const exports = exportList
    .map(exp => symbols[refId(exp)])
    .reduce(
      (summaries, exp) => {
        const { name, type: expTypeRef } = exp;
        const summary: ExportSummary = { name };
        if (expTypeRef) {
          const typ = types[refId(expTypeRef)];
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
