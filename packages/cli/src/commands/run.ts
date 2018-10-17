import { walkProgram } from '@code-to-json/core';
import chalk from 'chalk';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as ts from 'typescript';
import { promisify } from 'util';
import { debugLog } from '..';
import InvalidArgumentsError from '../invalid-arguments-error';

const DEFAULT_COMPILER_OPTIONS: ts.CompilerOptions = {
  allowJs: true,
  checkJs: true,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  target: ts.ScriptTarget.ESNext
};

function tsConfigForPath(filePath: string) {
  return ts.findConfigFile(filePath, (fileName: string) => true);
}

const pGlob = promisify(glob);

async function globsToPaths(
  globs: string[],
  extensions: string[] = ['.js', '.ts']
): Promise<string[]> {
  const valueSet = new Set<string>();
  await Promise.all(
    globs.map((g) =>
      pGlob(g)
        .then((files: string[]) => {
          files.forEach((f) => valueSet.add(f));
        })
        .catch((er) => {
          throw new InvalidArgumentsError(`Invalid glob: ${g}\n${er}`);
        })
    )
  );
  const allPaths = [...valueSet];
  // If extensions are provided, only return those files that match
  return extensions
    ? allPaths.filter(
        (f) => extensions.indexOf(path.extname(f).toLowerCase()) >= 0
      )
    : allPaths;
}

async function createProgramFromTsConfig(searchPath: string) {
  const cfgPath = tsConfigForPath(searchPath);
  if (!cfgPath) {
    throw new InvalidArgumentsError(
      `Could not find a tsconfig.json via path "${searchPath}"`
    );
  }
  debugLog('Found typescript configuration file: ', cfgPath);
  const configContent = ts.readConfigFile(cfgPath, (filePath: string) =>
    fs.readFileSync(filePath).toString()
  );
  const { error, config } = configContent;
  if (error) {
    debugLog('tsconfig diagnostics', error);
    throw new InvalidArgumentsError('TSConfig error - ' + error.messageText);
  } else if (config) {
    const diagReporter: ts.DiagnosticReporter = (ts as any).createDiagnosticReporter(
      ts.sys
    );
    const configResult = ts.getParsedCommandLineOfConfigFile(
      cfgPath,
      {},
      ts.sys as any
    );
    if (!configResult) {
      throw new InvalidArgumentsError(
        `Failed to parse config file "${cfgPath}"`
      );
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
    return ts.createProgram({
      rootNames,
      options
    });
  } else {
    throw new InvalidArgumentsError(
      'reading tsconfig seemed to neither suceed or fail'
    );
  }
}

async function createProgramFromEntries(globs: string[]): Promise<ts.Program> {
  const rootNames = await globsToPaths(globs);
  debugLog('Globs are equivalent to files', rootNames);
  const prog = ts.createProgram({
    rootNames,
    options: DEFAULT_COMPILER_OPTIONS
  });
  return prog;
}

export default async function run(
  options: { [k: string]: any } & { project: string },
  entries?: string[]
): Promise<void>;
export default async function run(
  options: { [k: string]: any },
  entries: string[]
): Promise<void>;
export default async function run(
  options: { [k: string]: any },
  rawEntries?: string[]
): Promise<void> {
  const { project } = options;
  let program!: ts.Program;
  if (typeof project === 'string') {
    program = await createProgramFromTsConfig(project);
  } else if (!project && rawEntries && rawEntries.length > 0) {
    program = await createProgramFromEntries(rawEntries);
  } else {
    throw new InvalidArgumentsError(
      'Either --program <path> or entries glob(s) must be defined'
    );
  }
  const walkResult = walkProgram(program);
  debugLog('walk result', walkResult);
  // console.log(walkResult);
  // const outputPath = path.isAbsolute(out) ? out : path.join(process.cwd(), out);
  // fs.writeFileSync(outputPath, JSON.stringify(walkResult, null, '  '));
}
// export default function run(
//   entries: string[],
//   out: string,
//   configPath?: string
// ) {
//   const beginTime = process.hrtime();
//   let tsCompilerOptions: ts.CompilerOptions;
//   if (configPath) {
//     // const cfgFileText = fs
//     //   .readFileSync(path.join(process.cwd(), configPath))
//     //   .toString();
//     const cfgPath = ts.findConfigFile(configPath, (fn: string) => true);
//     if (!cfgPath) throw new Error('No config file found');
//     const cfgFilePath = cfgPath;
//     // const cfgFilePath = path.isAbsolute(cfgPath)
//     //   ? cfgPath
//     //   : path.join(process.cwd(), cfgPath);
//     const { config, error } = ts.readConfigFile(cfgFilePath, (fPath: string) =>
//       fs.readFileSync(fPath).toString()
//     );
//     if (error) {
//       throw new Error(
//         `Problem reading ${cfgFilePath}\n${error.messageText.toString()}`
//       );
//     } else {
//       console.log(`Found config file\n${JSON.stringify(config, null, '  ')}`);
//     }
//     tsCompilerOptions = DEFAULT_COMPILER_OPTIONS;
//     entries = ['samples/ts-single-file/src/index.ts']; //config.files;
//   } else {
//     tsCompilerOptions = DEFAULT_COMPILER_OPTIONS;
//   }
//   console.log(
//     `Walking tree using TS compiler options \n${JSON.stringify(
//       tsCompilerOptions
//     )}`
//   );
//   console.log(`...and entries \n${JSON.stringify(entries)}`);
//   ts.createProgram;
//   let arr: any[] = [];
//   const prog = ts.createProgram({
//     rootNames: entries,
//     options: tsCompilerOptions,
//     configFileParsingDiagnostics: arr
//   });
//   console.log('DIAGNOSTICS=', arr);
//   const walkResult = walkProgram(prog);
//   const timeElapsed = process.hrtime(beginTime);
//   console.log(
//     `Code extraction took ${Math.round(
//       (timeElapsed[0] * NS_PER_SEC + timeElapsed[1]) / 1e3
//     ) / 1e3}ms`
//   );
//   console.log(walkResult);
//   const outputPath = path.isAbsolute(out) ? out : path.join(process.cwd(), out);
//   fs.writeFileSync(outputPath, JSON.stringify(walkResult, null, '  '));
// }
