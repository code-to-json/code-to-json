import { expect } from 'chai';
import * as commander from 'commander';
import { describe, it } from 'mocha';
import { buildProgram, runAction, timeString } from '../src/cli';

describe('Cli utilities tests', () => {
  it('program builds without error', async () => {
    let helpStr: string = '';
    const prog = buildProgram().parse([]);
    prog.outputHelp((str: string) => {
      helpStr = str;
      return str;
    });
    await new Promise(res => setTimeout(res, 100));
    expect(helpStr.length).to.be.greaterThan(0);
    expect(helpStr).to.eql(`Usage: code-to-json [options] [entries...]

a thing

Options:
  -p,--project [path]  path to tsconfig.json
  -o,--out <path>      output path
  --format [fmt]       data format (default: "formatted")
  -h, --help           output usage information
`);
  });

  it('timeString tests', async () => {
    const start = process.hrtime();
    await new Promise(res => setTimeout(res, 100));
    const delta = process.hrtime(start);
    const s = timeString(delta, 'test time');
    expect(s).to.contain(' ms (test time)');
  });

  it('runAction successful scenario', async () => {
    const cmd = commander.name('foo');
    const logs: string[] = [];
    function log(str: string): void {
      logs.push(str);
    }
    let invocationCt = 0;
    const a = runAction(
      cmd,
      async () => {
        invocationCt++;
      },
      log,
    );
    expect(!!a).to.eql(true, 'action is truthy');
    await a([], cmd);
    expect(invocationCt).to.eq(1);
    expect(
      logs.map(s =>
        s
          .substr(s.indexOf('(') + 1)
          .replace(')', '')
          .trim(),
      ),
    ).to.deep.eq(['boot time', 'extraction time']);
  });

  it('runAction runtime error scenario', async () => {
    const cmd = commander.name('foo');
    const logs: string[] = [];
    function log(str: string): void {
      logs.push(str);
    }
    let invocationCt = 0;
    const a = runAction(
      cmd,
      async () => {
        invocationCt++;
        throw new Error('foo');
      },
      log,
    );
    expect(!!a).to.eql(true, 'action is truthy');
    expect(logs.map(s => s.substr(s.indexOf(')') + 1).trim())).to.deep.eq([]);

    try {
      await a([], cmd);
      expect(false).to.eql(true);
    } catch (err) {
      expect(invocationCt).to.eq(1);
      expect(true).to.eql(true);
    }
  });
});
