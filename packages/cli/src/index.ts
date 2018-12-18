/* eslint-disable no-console */
const start = process.hrtime();

import chalk from 'chalk';
import * as commander from 'commander';
import * as debug from 'debug';
import * as leftpad from 'left-pad';
import run from './commands/run';

// tslint:disable-next-line:no-var-requires
// const pkg = require('../../package.json');

const NS_PER_SEC = 1e9;

process.title = 'code-to-json';

export const debugLog = debug('code-to-json:cli');

export async function runCli({ args }: { args: string[] }): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    debugLog('about to kick of CLI parsing');
    let actionInvoked = false;

    const prog = commander
      .name('code-to-json')
      .arguments('[entries...]')
      .description('a thing')
      .option('-p,--project [path]', 'path to tsconfig.json')
      .option('-o,--out <path>', 'output path')
      .action((entries: string[] | undefined, _command: commander.Command) => {
        actionInvoked = true;
        setTimeout(async () => {
          const opts = _command.opts();
          const { project } = opts;
          const startupElapsed = process.hrtime(start);
          debugLog(
            `${chalk.yellow(
              leftpad(
                (
                  Math.round((startupElapsed[0] * NS_PER_SEC + startupElapsed[1]) / 1e3) / 1e3
                ).toFixed(3),
                6,
              ),
            )} ms ${chalk.green('(startup time)')}
`,
          );
          const beginTime = process.hrtime();
          try {
            await run({ ...opts, project }, entries).then(() => {
              const timeElapsed = process.hrtime(beginTime);
              debugLog(
                `${chalk.yellow(
                  leftpad(
                    (
                      Math.round((timeElapsed[0] * NS_PER_SEC + timeElapsed[1]) / 1e3) / 1e3
                    ).toFixed(3),
                    6,
                  ),
                )} ms ${chalk.green('(extraction time)')}
`,
              );
            });
          } catch (er) {
            if (er.__invalid_arguments_error) {
              debugLog('completing due to invalid arguments');
              console.error(chalk.red(`\n[ERROR] - ${er.message}\n`));
              console.error(`${prog.help()}\n`);
              reject(new Error('invalid arguments'));
            } else {
              throw er;
            }
          }
          resolve();
        }, 0);
      })
      .parse(args);
    debugLog('command parsed');

    if (!actionInvoked) {
      setTimeout(() => {
        debugLog('completing due to no action being invoked');
        console.error(`${prog.help()}\n`);
        reject(new Error('No action'));
      }, 0);
    }
  });
}
