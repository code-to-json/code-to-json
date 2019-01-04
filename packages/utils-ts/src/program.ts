import {
  FileExistenceChecker,
  InvalidArgumentsError,
  TextFileReader,
  UnreachableError,
} from '@code-to-json/utils';
import * as debug from 'debug';
import {
  CompilerOptions,
  createProgram,
  createSourceFile,
  findConfigFile,
  getParsedCommandLineOfConfigFile,
  ModuleKind,
  ModuleResolutionKind,
  Program,
  readConfigFile,
  ScriptKind,
  ScriptTarget,
  sys,
} from 'typescript';
import TranspileOuptut from './program/transpile-output';
import TranspileOuptutData from './program/transpile-output-data';

const debugLog = debug('code-to-json:cli');

const DEFAULT_COMPILER_OPTIONS: CompilerOptions = {
  allowJs: true,
  checkJs: true,
  moduleResolution: ModuleResolutionKind.NodeJs,
  target: ScriptTarget.ESNext,
};

const STD_COMPILER_OPTIONS: CompilerOptions = {
  module: ModuleKind.CommonJS,
  target: ScriptTarget.ES5,
  noLib: true,
  noResolve: true,
  checkJs: true,
  allowJs: true,
  suppressOutputPathCheck: true,
};

/**
 * Create a typescript program, given a search path
 * @param searchPath Search path to use when looking for a typescript configuration
 */
export async function createProgramFromTsConfig(
  searchPath: string,
  r: TextFileReader,
  e: FileExistenceChecker,
): Promise<Program> {
  const cfgPath = findConfigFile(searchPath, e);
  if (!cfgPath) {
    throw new InvalidArgumentsError(`Could not find a tsconfig.json via path "${searchPath}"`);
  }
  debugLog('Found typescript configuration file: ', cfgPath);
  const configContent = readConfigFile(cfgPath, r);
  const { error, config } = configContent;
  if (error) {
    debugLog('tsconfig diagnostics', error);
    throw new InvalidArgumentsError(`TSConfig error - ${error.messageText}`);
  } else if (config) {
    const configResult = getParsedCommandLineOfConfigFile(cfgPath, {}, sys as any);
    if (!configResult) {
      throw new InvalidArgumentsError(`Failed to parse config file "${cfgPath}"`);
    }
    const { fileNames: rootNames, options, errors } = configResult;
    if (errors && errors.length > 0) {
      debugLog('tsconfig config parse errors', errors);
      throw new InvalidArgumentsError(
        `Detected errors while parsing tsconfig file: ${JSON.stringify(errors)}`,
      );
    }
    debugLog('Using typescript compiler options', options);
    debugLog('applying to files', rootNames);
    return createProgram({
      rootNames,
      options,
    });
  } else {
    throw new InvalidArgumentsError('reading tsconfig seemed to neither suceed or fail');
  }
}

/**
 * Create a typescript program from a list of entry files
 * @param entries paths to one or more entries
 */
export async function createProgramFromEntries(entries: string[]): Promise<Program> {
  const prog = createProgram({
    rootNames: entries,
    options: DEFAULT_COMPILER_OPTIONS,
  });
  return prog;
}

function transpileModule(
  input: string,
  inputFileName: string,
  scriptKind: ScriptKind,
  options: CompilerOptions,
): TranspileOuptut {
  const sourceFile = createSourceFile(inputFileName, input, options.target || ScriptTarget.ES5);
  return new TranspileOuptutData(inputFileName, sourceFile, options);
}

function determineFileExtension(codeType: 'ts' | 'js'): string {
  return codeType;
}

function determineScriptKind(codeType: 'ts' | 'js', options: CompilerOptions): ScriptKind {
  const isJsx = !!options.jsx;
  switch (codeType) {
    case 'ts':
      return isJsx ? ScriptKind.TSX : ScriptKind.TS;
    case 'js':
      return isJsx ? ScriptKind.JSX : ScriptKind.JS;
    default:
      throw new UnreachableError(codeType);
  }
}

export function createProgramFromCodeString(
  input: string,
  codeType: 'ts' | 'js',
  options: Partial<Pick<CompilerOptions, 'target' | 'jsx' | 'module'>> = {},
): TranspileOuptut {
  const opts: CompilerOptions = { ...options, ...STD_COMPILER_OPTIONS };
  const scriptKind: ScriptKind = determineScriptKind(codeType, opts);
  return transpileModule(
    input,
    `module.${determineFileExtension(codeType)}${opts.jsx ? 'x' : ''}`,
    scriptKind,
    opts,
  );
}