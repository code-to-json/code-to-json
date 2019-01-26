/* eslint-disable no-param-reassign */

import { walkProgram } from '@code-to-json/core';
import { setupTestCase } from '@code-to-json/test-helpers';
import { nodeHost } from '@code-to-json/utils-node';
import {
  FormattedSourceFile,
  FormattedSymbol,
  FormattedType,
  FormatterOutputData,
  formatWalkerOutput,
} from '../../src';

const STANDARD_REPLACERS = (rootPath: string) =>
  [[rootPath, '--ROOT PATH--']] as Array<[string | RegExp, string]>;

export async function fullFormattedOutput(
  codeString: string,
): Promise<{ data: FormatterOutputData; cleanup: () => void; rootPath: string }> {
  const { program, cleanup, rootPath } = await setupTestCase(
    {
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
    data,
    data: { types, symbols, sourceFiles },
  } = formatWalkerOutput(walkerOutput);

  Object.keys(types).forEach(t =>
    sanitizeFormattedType(types[t], { replace: STANDARD_REPLACERS(rootPath) }),
  );
  Object.keys(symbols).forEach(k =>
    sanitizeFormattedSymbol(symbols[k], { replace: STANDARD_REPLACERS(rootPath) }),
  );
  Object.keys(sourceFiles).forEach(k =>
    sanitizeFormattedSourceFile(sourceFiles[k], { replace: STANDARD_REPLACERS(rootPath) }),
  );

  return { data, cleanup, rootPath };
}

function sanitizeFormattedSymbol(
  symbol: FormattedSymbol | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!symbol) {
    return;
  }
  replace.forEach(rep => {
    symbol.name = symbol.name.replace(rep[0], rep[1]);
    if (symbol.text) {
      symbol.text = symbol.text.replace(rep[0], rep[1]);
    }
  });
}

function sanitizeFormattedType(
  type: FormattedType | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!type) {
    return;
  }
  replace.forEach(rep => {
    type.text = type.text.replace(rep[0], rep[1]);
  });
}

function sanitizeFormattedSourceFile(
  type: FormattedSourceFile | undefined,
  options: { replace: Array<[string | RegExp, string]> },
): void {
  const { replace } = options;
  if (!type) {
    return;
  }
  replace.forEach(rep => {
    if (type.moduleName) {
      type.moduleName = type.moduleName.replace(rep[0], rep[1]);
    }
    type.path = type.path.replace(rep[0], rep[1]);
    type.path = type.path.replace(rep[0], rep[1]);
  });
}
