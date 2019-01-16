const start = process.hrtime();

import chalk from 'chalk';
import * as commander from 'commander';
import * as debug from 'debug';
import * as leftpad from 'left-pad';
import generateJSON from './commands/generate-json';

const NS_PER_SEC = 1e9;
const PROGRAM_NAME = 'code-to-json';
process.title = PROGRAM_NAME;

const debugLog = debug('code-to-json:cli');

/**
 * Convert a hrtime into human-readable text
 * @param time proces.hrtime value
 * @param message description of time value
 * @internal
 */
export function timeString(time: [number, number], message: string): string {
  const msg = `(${message})`;
  return `${chalk.yellow(
    leftpad((Math.round((time[0] * NS_PER_SEC + time[1]) / 1e3) / 1e3).toFixed(3), 6),
  )} ms ${chalk.green(msg)}
`;
}

/**
 * Build the commander program
 * @internal
 */
export function buildProgram(): commander.Command {
  return commander
    .name(PROGRAM_NAME)
    .arguments('[entries...]')
    .description('a thing')
    .option('-p,--project [path]', 'path to tsconfig.json')
    .option('-o,--out <path>', 'output path');
}

/**
 * Run a CLI action
 * @param prog commander program
 * @param runnable the action
 * @internal
 */
export function runAction(
  prog: commander.Command,
  runnable: (
    opts: {
      [key: string]: any;
    },
    project: string,
    entries: string[] | undefined,
  ) => Promise<void>,
  log: (formatter: any, ...args: any[]) => void,
): (entries: string[] | undefined, cmd: commander.Command) => any {
  return async function runActionImpl(
    entries: string[] | undefined,
    command: commander.Command,
  ): Promise<void> {
    const opts = command.opts();
    const { project } = opts;
    const startupElapsed = process.hrtime(start);
    log(timeString(startupElapsed, 'boot time'));
    const beginTime = process.hrtime();
    try {
      await runnable(opts, project, entries).then(() => {
        const timeElapsed = process.hrtime(beginTime);
        log(timeString(timeElapsed, 'extraction time'));
      });
    } catch (er) {
      if (er.__invalid_arguments_error) {
        log('completing due to invalid arguments');
        console.error(chalk.red(`\n[ERROR] - ${er.message}\n`));
        console.error(`${prog.help()}\n`);
        throw new Error('invalid arguments');
      } else {
        throw er;
      }
    }
  };
}

/**
 * Run the code-to-json cli command
 * @param args command-line arguments
 */
export function runCli(args: string[]): void {
  const prog = buildProgram();

  prog
    .action(
      runAction(
        prog,
        (opts, project: string, entries: string[] | undefined) =>
          generateJSON({ ...opts, project }, entries),
        debugLog,
      ),
    )
    .parse(args);
}
