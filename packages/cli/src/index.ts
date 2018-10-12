import * as commander from 'commander';
import { validateConfig } from './config';
const pkg = require('../../package.json');

let actionInvoked = false;
const prog = commander
  .version(pkg.version)
  .name('code-to-json')
  .arguments('<project>')
  .description('a thing')
  .option('-c,--config <path to tsconfig>', 'path to tsconfig.json')
  .action(function(project: string) {
    actionInvoked = true;
    setTimeout(() => {
      let allOpts: { [k: string]: string } = { project, ...prog.opts() };
      const validationResult = validateConfig(allOpts);
      debugger;
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
