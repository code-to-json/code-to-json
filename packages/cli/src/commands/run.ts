import { walkProgram } from '@code-to-json/core';
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
  sys
} from 'typescript';
import { promisify } from 'util';
import { debugLog } from '..';
import InvalidArgumentsError from '../invalid-arguments-error';

const DEFAULT_COMPILER_OPTIONS: CompilerOptions = {
  allowJs: true,
  checkJs: true,
  moduleResolution: ModuleResolutionKind.NodeJs,
  target: ScriptTarget.ESNext
};

/**
 * Find the path to an appropriate TSConfig, given a search path
 * @param filePath path to search
 */
function tsConfigForPath(filePath: string): string | undefined {
  return findConfigFile(filePath, () => true);
}

const pGlob = promisify(glob);

/**
 * Resolve some globs into discrete files, matching a set of extensions
 * @param globs Globs to search
 * @param extensions Extensions of paths to retain
 */
async function globsToPaths(
  globs: string[],
  extensions: string[] = ['.js', '.ts']
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
        })
    )
  );
  const allPaths = [...valueSet];
  // If extensions are provided, only return those files that match
  return extensions
    ? allPaths.filter(f => extensions.indexOf(path.extname(f).toLowerCase()) >= 0)
    : allPaths;
}

/**
 * Create a typescript program, given a search path
 * @param searchPath Search path to use when looking for a typescript configuration
 */
async function createProgramFromTsConfig(searchPath: string): Promise<Program> {
  const cfgPath = tsConfigForPath(searchPath);
  if (!cfgPath) {
    throw new InvalidArgumentsError(`Could not find a tsconfig.json via path "${searchPath}"`);
  }
  debugLog('Found typescript configuration file: ', cfgPath);
  const configContent = readConfigFile(cfgPath, (filePath: string) =>
    fs.readFileSync(filePath).toString()
  );
  const { error, config } = configContent;
  if (error) {
    debugLog('tsconfig diagnostics', error);
    throw new InvalidArgumentsError('TSConfig error - ' + error.messageText);
  } else if (config) {
    // const diagReporter: ts.DiagnosticReporter = (ts as any).createDiagnosticReporter(
    //   ts.sys
    // );
    const configResult = getParsedCommandLineOfConfigFile(cfgPath, {}, sys as any);
    if (!configResult) {
      throw new InvalidArgumentsError(`Failed to parse config file "${cfgPath}"`);
    }
    const { fileNames: rootNames, options, errors } = configResult;
    if (errors && errors.length > 0) {
      debugLog('tsconfig config parse errors', errors);
      throw new InvalidArgumentsError(
        `Detected errors while parsing tsconfig file: ${JSON.stringify(errors)}`
      );
    }
    debugLog('Using typescript compiler options', options);
    debugLog('applying to files', rootNames);
    return createProgram({
      rootNames,
      options
    });
  } else {
    throw new InvalidArgumentsError('reading tsconfig seemed to neither suceed or fail');
  }
}

/**
 * Create a typescript program from globs that describe entry files
 * @param globs Globs that specify one or more entries
 */
async function createProgramFromEntries(globs: string[]): Promise<Program> {
  const rootNames = await globsToPaths(globs);
  debugLog('Globs are equivalent to files', rootNames);
  const prog = createProgram({
    rootNames,
    options: DEFAULT_COMPILER_OPTIONS
  });
  return prog;
}

/**
 * Run the symbol walker to generate a JSON file based on some code
 * @param options CLI options
 * @param entries an array of entry globs
 */
export default async function run(
  options: { [k: string]: any } & { project: string },
  entries?: string[]
): Promise<void>;
export default async function run(options: { [k: string]: any }, entries: string[]): Promise<void>;
export default async function run(
  options: { [k: string]: any },
  rawEntries?: string[]
): Promise<void> {
  const { project, out = 'out.json' } = options;
  let program!: Program;
  if (typeof project === 'string') {
    program = await createProgramFromTsConfig(project);
  } else if (!project && rawEntries && rawEntries.length > 0) {
    program = await createProgramFromEntries(rawEntries);
  } else {
    throw new InvalidArgumentsError('Either --program <path> or entries glob(s) must be defined');
  }
  const walkResult = walkProgram(program);
  // debugLog('walk result', walkResult);
  // console.log(walkResult);
  const outputPath = path.isAbsolute(out) ? out : path.join(process.cwd(), out);
  fs.writeFileSync(outputPath, JSON.stringify(walkResult, null, '  '));
}
