import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { join } from 'path';
import { createProgram } from 'typescript';
import CompilerHost from '../src/compiler-host';
import { nodeHost } from './helpers';

@suite
export class CompilerHostTests {
  @test public 'invalid attemot to obtain the name of a tslib'(): void {
    const ch = new CompilerHost(nodeHost);
    const prog = createProgram(
      [join(__dirname, '..', '..', '..', 'samples', 'ts-multi-file')],
      {},
      ch,
    );
    expect(prog.getSourceFiles().length).to.be.gt(0);
  }
}
