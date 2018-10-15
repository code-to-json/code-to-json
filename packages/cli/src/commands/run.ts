import * as path from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';
import * as debug from 'debug';
import { debuglog } from 'util';
import { walkProgram } from '@code-to-json/core';

const DEFAULT_COMPILER_OPTIONS: ts.CompilerOptions = {
  allowJs: true
};
const NS_PER_SEC = 1e9;

const debugLog = debug('code-to-json:cli');

export default function run(
  entries: string[],
  out: string,
  configPath?: string
) {
  const beginTime = process.hrtime();
  let tsCompilerOptions: ts.CompilerOptions;
  if (configPath) {
    // const cfgFileText = fs
    //   .readFileSync(path.join(process.cwd(), configPath))
    //   .toString();
    const cfgPath = ts.findConfigFile(configPath, (fn: string) => true);
    if (!cfgPath) throw new Error('No config file found');
    const cfgFilePath = path.isAbsolute(cfgPath)
      ? cfgPath
      : path.join(process.cwd(), cfgPath);
    const { config, error } = ts.readConfigFile(cfgFilePath, (fPath: string) =>
      fs.readFileSync(fPath).toString()
    );
    if (error) {
      throw new Error(
        `Problem reading ${cfgFilePath}\n${error.messageText.toString()}`
      );
    }
    tsCompilerOptions = config.compilerOptions;
  } else {
    tsCompilerOptions = DEFAULT_COMPILER_OPTIONS;
  }
  debuglog(
    `Walking tree using TS compiler options \n${JSON.stringify(
      tsCompilerOptions
    )}`
  );
  debuglog(`...and entries \n${JSON.stringify(entries)}`);
  const prog = ts.createProgram({
    rootNames: entries,
    options: tsCompilerOptions
  });
  const walkResult = walkProgram(prog);
  const timeElapsed = process.hrtime(beginTime);
  console.log(
    `Code extraction took ${Math.round(
      (timeElapsed[0] * NS_PER_SEC + timeElapsed[1]) / 1e3
    ) / 1e3}ms`
  );
  console.log(walkResult);
  const outputPath = path.isAbsolute(out) ? out : path.join(process.cwd(), out);
  fs.writeFileSync(outputPath, JSON.stringify(walkResult, null, '  '));
}
