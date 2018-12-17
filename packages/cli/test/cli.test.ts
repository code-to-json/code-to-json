import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { runCli } from '../src/index';

function timeout(n: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, n);
  });
}

@suite
class CliTests {
  @test
  public async method(): Promise<void> {
    const outArgs: string[] = [];
    const errArgs: string[] = [];
    const exitArgs: number[] = [];
    await runCli({
      args: ['', 'code-to-json', '--help'],
      out(str: string) {
        outArgs.push(str);
      },
      err(str: string) {
        errArgs.push(str);
      },
      exit(code: number) {
        exitArgs.push(code);
      },
    });
    await timeout(200);
    expect(true).to.eql(true);
    expect(outArgs).to.eql([]);
    expect(errArgs).to.eql([]);
    expect(exitArgs).to.eql([]);
  }
}
