import { walkProgram } from '@code-to-json/core';
import { formatWalkerOutput } from '@code-to-json/formatter';
import { InvalidArgumentsError } from '@code-to-json/utils';
import { nodeHost, pathNormalizerForPackageJson } from '@code-to-json/utils-node';
import {
  createProgramFromTsConfig,
  PASSTHROUGH_MODULE_PATH_NORMALIZER,
} from '@code-to-json/utils-ts';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { createProgramFromEntryGlobs } from '../command-utils';

/**
 * Run the symbol walker to generate a JSON file based on some code
 * @param options CLI options
 * @param entries an array of entry globs
 * @internal
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
  let program!: ts.Program;
  let pathNormalizer = PASSTHROUGH_MODULE_PATH_NORMALIZER;

  if (typeof project === 'string') {
    // run tool based on tsconfig.json
    program = await createProgramFromTsConfig(project, nodeHost);
    pathNormalizer = await pathNormalizerForPackageJson(project, nodeHost);
  } else if (!project && rawEntries && rawEntries.length > 0) {
    // run tool based on entries
    program = await createProgramFromEntryGlobs(rawEntries);
  } else {
    throw new InvalidArgumentsError('Either --project <path> or entries glob(s) must be defined');
  }
  // get the raw result
  const walkResult = walkProgram(program, nodeHost, {
    pathNormalizer,
  });

  // get the formatted result
  const formattedResult = formatWalkerOutput(walkResult);
  // determine the appropriate place(s) to write output files
  const outputPath = path.isAbsolute(out) ? out : path.join(process.cwd(), out);
  const rawOutputPath = path.join(outputPath, 'raw.json');
  const formattedOutputPath = path.join(outputPath, 'formatted.json');
  // create the output folder if it doesn't currently exist
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  // write the raw output file
  fs.writeFileSync(rawOutputPath, JSON.stringify(walkResult, null, '  '));
  // write the formatted output file
  fs.writeFileSync(formattedOutputPath, JSON.stringify(formattedResult, null, '  '));
}
