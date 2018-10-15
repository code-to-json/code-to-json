import * as commander from 'commander';
import { validateConfig } from './config';
import run from './commands/run';
const pkg = require('../package.json');

process.title = 'code-to-json';
let actionInvoked = false;
const prog = commander
  .version(pkg.version)
  .name('code-to-json')
  .arguments('<entries...>')
  .description('a thing')
  .option('-c,--config <path>', 'path to tsconfig.json')
  .option('-o,--out <path>', 'output path')
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
        const cfg = validationResult[1];
        console.log('Valid config!', cfg);
        run(cfg.entries, cfg.out, cfg.configPath);
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
