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

export async function runCli({
  args,
  err,
  exit,
}: {
  err: (str: string) => void;
  out: (str: string) => void;
  args: string[];
  exit: (code: number) => void;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    let actionInvoked = false;

    const prog = commander
      .name('code-to-json')
      .arguments('[entries...]')
      .description('a thing')
      .option('-p,--project [path]', 'path to tsconfig.json')
      .option('-o,--out <path>', 'output path')
      .action((entries: string[] | undefined, _command: commander.Command) => {
        actionInvoked = true;
        setTimeout(() => {
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
            run({ ...opts, project }, entries).then(() => {
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
          } catch (err) {
            if (err.__invalid_arguments_error) {
              err(chalk.red(`\n[ERROR] - ${err.message}\n`));
              err(`${prog.help()}\n`);
              exit(1);
            } else {
              throw err;
            }
          }
          resolve();
        }, 0);
      })
      .parse(args);

    if (!actionInvoked) {
      setTimeout(() => {
        err(`${prog.help()}\n`);
        resolve();
        exit(1);
      }, 0);
    }
  });
}
