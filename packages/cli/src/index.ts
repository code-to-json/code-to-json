/* eslint-disable no-console */
const start = process.hrtime();

import chalk from 'chalk';
import * as commander from 'commander';
import * as debug from 'debug';
import * as leftpad from 'left-pad';
import { Node } from 'typescript';
import run from './commands/run';

// tslint:disable-next-line:no-var-requires
// const pkg = require('../../package.json');

const NS_PER_SEC = 1e9;
const PROGRAM_NAME = 'code-to-json';
process.title = PROGRAM_NAME;

export const debugLog = debug('code-to-json:cli');
const startupElapsed = process.hrtime(start);

export function timeString(time: [number, number], message: string): string {
  const msg = `(${message})`;
  return `${chalk.yellow(
    leftpad((Math.round((time[0] * NS_PER_SEC + time[1]) / 1e3) / 1e3).toFixed(3), 6),
  )} ms ${chalk.green(msg)}
`;
}

function buildProgram(): commander.Command {
  return commander
    .name(PROGRAM_NAME)
    .arguments('[entries...]')
    .description('a thing')
    .option('-p,--project [path]', 'path to tsconfig.json')
    .option('-o,--out <path>', 'output path');
}

function runAction(
  prog: commander.Command,
): (entries: string[] | undefined, cmd: commander.Command) => any {
  return async function runActionImpl(
    entries: string[] | undefined,
    command: commander.Command,
  ): Promise<void> {
    const opts = command.opts();
    const { project } = opts;
    debugLog(timeString(startupElapsed, 'boot time'));
    const beginTime = process.hrtime();
    try {
      await run({ ...opts, project }, entries).then(() => {
        const timeElapsed = process.hrtime(beginTime);
        debugLog(timeString(timeElapsed, 'extraction time'));
      });
    } catch (er) {
      if (er.__invalid_arguments_error) {
        debugLog('completing due to invalid arguments');
        console.error(chalk.red(`\n[ERROR] - ${er.message}\n`));
        console.error(`${prog.help()}\n`);
        throw new Error('invalid arguments');
      } else {
        throw er;
      }
    }
  };
}

export function runCli({ args }: { args: string[] }): void {
  const prog = buildProgram();

  prog.action(runAction(prog)).parse(args);
}
