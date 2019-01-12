import { setupTestCase } from '@code-to-json/test-helpers';
import { refId, refType } from '@code-to-json/utils';
import { nodeHost } from '@code-to-json/utils-node';
import { createProgramFromCodeString } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { WalkerOutput, walkProgram } from '../src';

interface TypeSummary {
  typeString: string;
  flags?: string[];
}

interface ExportSummary {
  name: string;
  type?: TypeSummary;
}

interface ExportSummaries {
  [k: string]: ExportSummary;
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
          const { flags, typeString } = types[refId(expTypeRef)];
          summary.type = {
            typeString,
          };
          if (flags) {
            summary.type.flags = flags;
          }
        }
        // eslint-disable-next-line no-param-reassign
        summaries[name] = summary;
        return summaries;
      },
      {} as ExportSummaries,
    );
  return { exports, cleanup };
}
