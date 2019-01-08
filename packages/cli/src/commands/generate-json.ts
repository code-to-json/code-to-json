import { walkProgram } from '@code-to-json/core';
import { formatWalkerOutput } from '@code-to-json/formatter';
import { InvalidArgumentsError } from '@code-to-json/utils';
import { NodeHost, pathNormalizerForPackageJson } from '@code-to-json/utils-node';
import {
  createProgramFromTsConfig,
  ModulePathNormalizer,
  PASSTHROUGH_MODULE_PATH_NORMALIZER,
} from '@code-to-json/utils-ts';
import * as fs from 'fs';
import * as path from 'path';
import { Program } from 'typescript';
import { createProgramFromEntryGlobs } from '../command-utils';

/**
 * Run the symbol walker to generate a JSON file based on some code
 * @param options CLI options
 * @param entries an array of entry globs
 */
export default async function generateJSON(
  options: { [k: string]: any } & { project?: string },
  entries?: string[],
): Promise<void>;
export default async function generateJSON(
  options: { [k: string]: any },
  entries: string[],
): Promise<void>;
export default async function generateJSON(
  options: { [k: string]: any },
  rawEntries?: string[],
): Promise<void> {
  const { project, out = 'out' } = options;
  let program!: Program;
  let pathNormalizer: ModulePathNormalizer = PASSTHROUGH_MODULE_PATH_NORMALIZER;

  const host = new NodeHost();
  if (typeof project === 'string') {
    program = await createProgramFromTsConfig(project, host);
    pathNormalizer = await pathNormalizerForPackageJson(project, host);
  } else if (!project && rawEntries && rawEntries.length > 0) {
    program = await createProgramFromEntryGlobs(rawEntries);
  } else {
    throw new InvalidArgumentsError('Either --project <path> or entries glob(s) must be defined');
  }
  const walkResult = walkProgram(program, host, {
    pathNormalizer,
  });

  const formattedResult = formatWalkerOutput(walkResult);
  const outputPath = path.isAbsolute(out) ? out : path.join(process.cwd(), out);
  const rawOutputPath = path.join(outputPath, 'raw.json');
  const formattedOutputPath = path.join(outputPath, 'formatted.json');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }
  fs.writeFileSync(rawOutputPath, JSON.stringify(walkResult, null, '  '));
  fs.writeFileSync(formattedOutputPath, JSON.stringify(formattedResult, null, '  '));
}
