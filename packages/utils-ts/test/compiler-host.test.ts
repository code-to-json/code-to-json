import { expect } from 'chai';
import { describe, it } from 'mocha';
import { join } from 'path';
import { createProgram } from 'typescript';
import CompilerHost from '../src/compiler-host';
import { nodeHost } from './helpers';

describe('Compiler host tests', () => {
  it('invalid attemot to obtain the name of a tslib', () => {
    const ch = new CompilerHost(nodeHost);
    const prog = createProgram(
      [join(__dirname, '..', '..', '..', 'samples', 'ts-multi-file')],
      {},
      ch,
    );
    expect(prog.getSourceFiles().length).to.be.gt(0);
  });
});
