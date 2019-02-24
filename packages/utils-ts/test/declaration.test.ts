import { expect } from 'chai';
import { describe, it } from 'mocha';
import { isAbstractDeclaration } from '../src/declaration';
import { filterDict } from '../src/dict';
import { setupSingleModuleProgram } from './helpers';

describe('Declaration utils tests', () => {
  it('invalid attemot to obtain the name of a tslib', async () => {
    const t = await setupSingleModuleProgram(
      `export abstract class Foo { abstract bar(): string };`,
    );
    const [file] = t.program.getSourceFiles().filter(f => !f.isDeclarationFile);
    expect(!!file).to.eq(true);
    const checker = t.program.getTypeChecker();
    const fileSym = checker.getSymbolAtLocation(file)!;
    const fooSym = filterDict(fileSym.exports!, () => true).Foo!;
    expect(fooSym.valueDeclaration.getText()).to.eq(
      'export abstract class Foo { abstract bar(): string }',
    );
    expect(isAbstractDeclaration(fooSym.valueDeclaration)).to.eq(true);
    t.cleanup();
  });
});
