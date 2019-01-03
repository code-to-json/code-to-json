import * as debug from 'debug';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import {
  CompilerOptions,
  createProgram,
  findConfigFile,
  getParsedCommandLineOfConfigFile,
  ModuleResolutionKind,
  Program,
  readConfigFile,
  ScriptTarget,
  sys,
} from 'typescript';
import { promisify } from 'util';

import InvalidArgumentsError from './invalid-arguments-error';

const debugLog = debug('code-to-json:cli');

const pGlob = promisify(glob);

const DEFAULT_COMPILER_OPTIONS: CompilerOptions = {
  allowJs: true,
  checkJs: true,
  moduleResolution: ModuleResolutionKind.NodeJs,
  target: ScriptTarget.ESNext,
};

/**
 * Resolve some globs into discrete files, matching a set of extensions
 * @param globs Globs to search
 * @param extensions Extensions of paths to retain
 */
export async function globsToPaths(
  globs: string[],
  extensions: string[] = ['.js', '.ts'],
): Promise<string[]> {
  const valueSet = new Set<string>();
  await Promise.all(
    globs.map(g =>
      pGlob(g)
        .then((files: string[]) => {
          files.forEach(f => valueSet.add(f));
        })
        .catch(er => {
          throw new InvalidArgumentsError(`Invalid glob: ${g}\n${er}`);
        }),
    ),
  );
  const allPaths = [...valueSet];
  // If extensions are provided, only return those files that match
  return extensions
    ? allPaths.filter(f => extensions.indexOf(path.extname(f).toLowerCase()) >= 0)
    : allPaths;
}

/**
 * Find the path to an appropriate TSConfig, given a search path
 * @param filePath path to search
 */
export function tsConfigForPath(filePath: string): string | undefined {
  return findConfigFile(filePath, () => true);
}

/**
 * Create a typescript program, given a search path
 * @param searchPath Search path to use when looking for a typescript configuration
 */
export async function createProgramFromTsConfig(searchPath: string): Promise<Program> {
  const cfgPath = tsConfigForPath(searchPath);
  if (!cfgPath) {
    throw new InvalidArgumentsError(`Could not find a tsconfig.json via path "${searchPath}"`);
  }
  debugLog('Found typescript configuration file: ', cfgPath);
  const configContent = readConfigFile(cfgPath, (filePath: string) =>
    fs.readFileSync(filePath).toString(),
  );
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
 * Create a typescript program from globs that describe entry files
 * @param globs Globs that specify one or more entries
 */
export async function createProgramFromEntries(globs: string[]): Promise<Program> {
  const rootNames = await globsToPaths(globs);
  debugLog('Globs are equivalent to files', rootNames);
  const prog = createProgram({
    rootNames,
    options: DEFAULT_COMPILER_OPTIONS,
  });
  return prog;
}
