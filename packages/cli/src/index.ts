import * as commander from 'commander';
import { validateConfig } from './config';
import run from './commands/run';
const pkg = require('../package.json');

let actionInvoked = false;
const prog = commander
  .version(pkg.version)
  .name('code-to-json')
  .arguments('<entries...>')
  .description('a thing')
  .option('-c,--config <config>', 'path to tsconfig.json')
  .action(function(entries: string[]) {
    actionInvoked = true;
    setTimeout(() => {
      let allOpts: { [k: string]: string | string[] } = {
        entries,
        ...prog.opts()
      };
      const validationResult = validateConfig(allOpts);
      if (validationResult[0] === 'error') {
        prog.outputHelp();
        throw validationResult[1];
      } else {
        console.log('Valid config!', validationResult[1]);
        process.exit(0);
      }
    }, 0);
  })
  .parse(process.argv);

if (!actionInvoked) {
  setTimeout(() => {
    console.log(prog.help());
    process.exit(1);
  }, 0);
}
