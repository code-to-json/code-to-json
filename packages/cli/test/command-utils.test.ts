import { createTempFixtureFolder, TestCaseFolder } from '@code-to-json/test-helpers';
import { expect } from 'chai';
import * as fs from 'fs';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import { findConfigFile } from 'typescript';
import { createProgramFromEntryGlobs, globsToPaths } from '../src/command-utils';

async function makeWorkspace(): Promise<TestCaseFolder> {
  const workspace = await createTempFixtureFolder({
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        allowJs: true,
        checkJs: true,
        target: 'ES2017',
        noEmit: true,
      },
    }),
    src: {
      'index.ts': "const x: string = 'foo';",
      'other.ts': "const y: string = 'bar';",
      'more.js': "const z = 'baz';",
    },
  });
  return workspace;
}

@suite
export class CommandUtilsTests {
  @test
  public async 'globToPathsTest - positive cases'(): Promise<void> {
    const workspace = await makeWorkspace();
    const myGlob = path.join(workspace.rootPath, 'src', '*');

    expect((await globsToPaths([myGlob])).length).to.eql(3, '3 files found');
    expect((await globsToPaths([myGlob], ['.js'])).length).to.eql(1, '1 js file found');
    expect((await globsToPaths([myGlob], ['.ts'])).length).to.eql(2, '2 ts files found');
    expect((await globsToPaths([myGlob], ['.qq'])).length).to.eql(0, '0 qq files found');
    workspace.cleanup();
  }

  @test
  public async 'globToPathsTest - negative case'(): Promise<void> {
    await globsToPaths([undefined as any])
      .then(() => {
        expect(false).to.eql(true);
      })
      .catch((err: Error) => {
        expect(err.message).to.contain('Invalid glob');
      });
  }

  @test
  public async tsConfigForEntryGlobsTest(): Promise<void> {
    const workspace = await makeWorkspace();

    const pth = findConfigFile(
      path.join(workspace.rootPath),
      f => fs.existsSync(f) && fs.statSync(f).isFile(),
    );
    if (!pth) {
      throw new Error('No path to tsconfig');
    }
    expect(pth).to.contain('tsconfig.json');
    expect(fs.existsSync(pth)).to.equal(true);
    workspace.cleanup();
  }

  @test
  public async 'createProgramFromEntryGlobs - simple case'(): Promise<void> {
    const workspace = await makeWorkspace();
    const myGlob = path.join(workspace.rootPath, 'src', '*');

    const globs = await globsToPaths([myGlob]);
    const prog = await createProgramFromEntryGlobs(globs);
    expect(!!prog).to.eql(true);
    expect(prog.getSourceFiles().filter(sf => !sf.isDeclarationFile).length).to.eql(3);
    expect(prog.getSourceFiles().length).to.be.greaterThan(3);
    workspace.cleanup();
  }
}
