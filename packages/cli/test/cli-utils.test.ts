// tslint:disable:no-duplicate-string

import { expect } from 'chai';
import * as commander from 'commander';
import { suite, test } from 'mocha-typescript';
import { buildProgram, runAction, timeString } from '../src/cli';
import InvalidArgumentsError from '../src/invalid-arguments-error';

@suite
class CliUtilTests {
  @test
  public async 'program builds without error'(): Promise<void> {
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
  -h, --help           output usage information
`);
  }

  @test
  public async 'timeString tests'(): Promise<void> {
    const start = process.hrtime();
    await new Promise(res => setTimeout(res, 100));
    const delta = process.hrtime(start);
    const s = timeString(delta, 'test time');
    expect(s).to.contain(' ms (test time)');
  }

  @test
  public async 'runAction successful scenario'(): Promise<void> {
    const cmd = commander.name('foo');
    const logs: string[] = [];
    function log(str: string) {
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
  }

  @test
  public async 'runAction runtime error scenario'(): Promise<void> {
    const cmd = commander.name('foo');
    const logs: string[] = [];
    function log(str: string) {
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
    try {
      await a([], cmd);
      expect(false).to.eql(true);
    } catch (err) {
      expect(invocationCt).to.eq(1);
      expect(true).to.eql(true);
    }
  }
}
