import { expect } from 'chai';
import * as fs from 'fs';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import * as tmp from 'tmp';
import { createTempFixtureFolder } from '../src/file-fixtures';
import { setupTestCase } from '../src/index';

export const TEST_CASES_FOLDER_PATH = path.join(__dirname, '..', 'test-cases');
const SIMPLE_VARIABLES_TEST_CASE_NAME = 'simple-variables';

@suite
export class TestCaseCreation {
  @test
  public async 'Create a new test case folder from a template'(): Promise<void> {
    const { rootPath, cleanup } = await createTempFixtureFolder(
      path.join(TEST_CASES_FOLDER_PATH, SIMPLE_VARIABLES_TEST_CASE_NAME),
    );
    expect(rootPath).to.be.a('string');
    expect(cleanup).to.be.a('function');
    expect(rootPath).length.to.be.greaterThan(0);
    expect(cleanup).to.be.an.instanceOf(Function);
    cleanup();
  }

  @test
  public async 'Attempting to create a test case from a non-existent folder'(): Promise<void> {
    const errors: Error[] = [];
    await createTempFixtureFolder(path.join(TEST_CASES_FOLDER_PATH, 'foo-bar-baz')).catch(err => {
      errors.push(err);
    });
    expect(errors.length).to.eq(1);
    expect(errors[0].message).to.contain('does not exist');
  }

  @test
  public async 'Attempting to create a test case from a non-folder (file)'(): Promise<void> {
    const workspace = tmp.dirSync({ unsafeCleanup: true });
    const filePath = path.join(workspace.name, 'file.txt');
    fs.writeFileSync(filePath, 'hello world');
    const errors: Error[] = [];
    await createTempFixtureFolder(filePath).catch(err => {
      errors.push(err);
    });
    expect(errors.length).to.eq(1);
    workspace.removeCallback();
  }

  @test
  public async 'Create a new test case from a template on disk'(): Promise<void> {
    const { rootPath, program, cleanup } = await setupTestCase(
      path.join(TEST_CASES_FOLDER_PATH, SIMPLE_VARIABLES_TEST_CASE_NAME),
      ['src/index.ts'],
    );
    expect(rootPath).to.be.a('string');
    expect(cleanup).to.be.a('function');
    expect(program).to.be.a('object');
    expect(rootPath).length.to.be.greaterThan(0);
    expect(cleanup).to.be.an.instanceOf(Function);
    const relevantFiles = program
      .getSourceFiles()
      .filter(sf => !sf.isDeclarationFile)
      .map(sf => sf.fileName);
    expect(relevantFiles).to.have.lengthOf(1);
    cleanup();
  }

  @test
  public async 'Create a new test case from a template object'(): Promise<void> {
    const { rootPath, program, cleanup } = await setupTestCase(
      {
        'tsconfig.json': `{
        "compilerOptions": {
          "noEmit": true,
          "module": "es6",
          "target": "es2015"
        },
        "include": ["src"]
      }
      `,
        src: {
          'index.ts': `/**
          * This is a variable with an explicit type
          */
         const constWithExplicitType: string = 'foo';
         /**
          * This is a variable might be undefined
          */
         const constMaybeUndefined: string | undefined = 'foo';
         /**
          * This is a variable might be undefined, and is also reassignable;
          */
         let letMaybeUndefined: string | undefined;
         letMaybeUndefined = 'foo';
         /**
          * This is a variable with an implicit type
          */
         const constWithImplicitType = 'foo';
         `,
        },
      },
      ['src/index.ts'],
    );
    expect(rootPath).to.be.a('string');
    expect(cleanup).to.be.a('function');
    expect(program).to.be.a('object');
    expect(rootPath).length.to.be.greaterThan(0);
    expect(cleanup).to.be.an.instanceOf(Function);
    const relevantFiles = program
      .getSourceFiles()
      .filter(sf => !sf.isDeclarationFile)
      .map(sf => sf.fileName);
    expect(relevantFiles).to.have.lengthOf(1);
    cleanup();
  }

  @test
  public async 'Test case actually exists on disk, and is a folder'(): Promise<void> {
    const { rootPath } = await createTempFixtureFolder(
      path.join(TEST_CASES_FOLDER_PATH, SIMPLE_VARIABLES_TEST_CASE_NAME),
    );
    expect(fs.existsSync(rootPath), 'exists').to.equal(true);
    expect(fs.statSync(rootPath).isDirectory(), 'is a directory').to.equal(true);
  }

  @test
  public async 'Cleanup function removes test case from disk'(): Promise<void> {
    const { rootPath, cleanup } = await createTempFixtureFolder(
      path.join(TEST_CASES_FOLDER_PATH, SIMPLE_VARIABLES_TEST_CASE_NAME),
    );
    expect(fs.existsSync(rootPath), 'exists').to.equal(true);
    cleanup();
    expect(fs.existsSync(rootPath), 'exists').to.equal(false);
  }
}
