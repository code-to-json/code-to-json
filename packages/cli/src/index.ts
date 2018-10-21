const start = process.hrtime();

import chalk from 'chalk';
import * as commander from 'commander';
import * as debug from 'debug';
import * as leftpad from 'left-pad';
import run from './commands/run';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

const NS_PER_SEC = 1e9;

process.title = 'code-to-json';

let actionInvoked = false;

export const debugLog = debug('code-to-json:cli');

const prog = commander
  .version(pkg.version)
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
            (Math.round((startupElapsed[0] * NS_PER_SEC + startupElapsed[1]) / 1e3) / 1e3).toFixed(
              3
            ),
            6
          )
        )} ms ${chalk.green('(startup time)')}
`
      );
      const beginTime = process.hrtime();
      try {
        run({ ...opts, project }, entries).then(() => {
          const timeElapsed = process.hrtime(beginTime);
          debugLog(
            `${chalk.yellow(
              leftpad(
                (Math.round((timeElapsed[0] * NS_PER_SEC + timeElapsed[1]) / 1e3) / 1e3).toFixed(3),
                6
              )
            )} ms ${chalk.green('(extraction time)')}
`
          );
        });
      } catch (err) {
        if (err.__invalid_arguments_error) {
          process.stderr.write(chalk.red(`\n[ERROR] - ${err.message}\n`));
          process.stderr.write(prog.help() + '\n');
          process.exit(1);
        } else {
          throw err;
        }
      }
    }, 0);
  })
  .parse(process.argv);

if (!actionInvoked) {
  setTimeout(() => {
    process.stderr.write(prog.help() + '\n');
    process.exit(1);
  }, 0);
}
