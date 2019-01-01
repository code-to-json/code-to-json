// tslint:disable:no-duplicate-string
import { createTempFixtureFolder, TestCaseFolder } from '@code-to-json/test-helpers';
import { expect } from 'chai';
import * as fs from 'fs';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import {
  createProgramFromEntries,
  createProgramFromTsConfig,
  globsToPaths,
  tsConfigForPath,
} from '../src/command-utils';

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
class CommandUtilsTests {
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
  public async tsConfigForPathTests(): Promise<void> {
    const workspace = await makeWorkspace();

    const pth = tsConfigForPath(path.join(workspace.rootPath));
    expect(pth).to.eql(path.join(workspace.rootPath, 'tsconfig.json'));
    workspace.cleanup();
  }

  @test
  public async 'createProgramFromTsConfig - simple case'(): Promise<void> {
    const workspace = await makeWorkspace();

    const prog = await createProgramFromTsConfig(workspace.rootPath);
    expect(!!prog).to.eql(true);
    expect(prog.getSourceFiles().filter(sf => !sf.isDeclarationFile).length).to.eql(3);
    expect(prog.getSourceFiles().length).to.be.greaterThan(3);
    workspace.cleanup();
  }

  @test
  public async 'createProgramFromEntries - simple case'(): Promise<void> {
    const workspace = await makeWorkspace();
    const myGlob = path.join(workspace.rootPath, 'src', '*');

    const globs = await globsToPaths([myGlob]);
    const prog = await createProgramFromEntries(globs);
    expect(!!prog).to.eql(true);
    expect(prog.getSourceFiles().filter(sf => !sf.isDeclarationFile).length).to.eql(3);
    expect(prog.getSourceFiles().length).to.be.greaterThan(3);
    workspace.cleanup();
  }

  @test
  public async 'createProgramFromTsConfig - missing config'(): Promise<void> {
    const workspace = await makeWorkspace();
    fs.unlinkSync(path.join(workspace.rootPath, 'tsconfig.json'));

    await createProgramFromTsConfig(workspace.rootPath)
      .then(() => {
        expect(false).to.eql(true);
      })
      .catch((err: Error) => {
        expect(err.message).to.contain('TSConfig error');
      });
    workspace.cleanup();
  }

  @test
  public async 'createProgramFromTsConfig - invalid config (non-json)'(): Promise<void> {
    const workspace = await makeWorkspace();
    fs.writeFileSync(path.join(workspace.rootPath, 'tsconfig.json'), '---');

    await createProgramFromTsConfig(workspace.rootPath)
      .then(() => {
        expect(false).to.eql(true);
      })
      .catch((err: Error) => {
        expect(err.message).to.contain('TSConfig error');
      });
    workspace.cleanup();
  }

  @test
  public async 'createProgramFromTsConfig - invalid config (invalid schema)'(): Promise<void> {
    const workspace = await makeWorkspace();
    fs.writeFileSync(
      path.join(workspace.rootPath, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: 'foo',
      }),
    );

    await createProgramFromTsConfig(workspace.rootPath)
      .then(() => {
        expect(false).to.eql(true);
      })
      .catch((err: Error) => {
        expect(err.message).to.contain('Detected errors while parsing tsconfig file');
      });
    workspace.cleanup();
  }
}
