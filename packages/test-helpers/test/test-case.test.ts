import { expect } from 'chai';
import * as fs from 'fs';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import { setupTestCase, setupTestCaseFolder } from '../src/index';

export const TEST_CASES_FOLDER_PATH = path.join(__dirname, '..', 'test-cases');

@suite
export class TestCaseCreation {
  @test
  public async 'Create a new test case folder from a template'() {
    const { rootPath, cleanup } = await setupTestCaseFolder(
      path.join(TEST_CASES_FOLDER_PATH, 'simple-variables')
    );
    expect(rootPath).to.exist('string');
    expect(cleanup).to.exist('string');
    expect(rootPath).length.to.be.greaterThan(0);
    expect(cleanup).to.be.an.instanceOf(Function);
    cleanup();
  }
  @test
  public async 'Create a new test case from a template'() {
    const { rootPath, program, cleanup } = await setupTestCase(
      path.join(TEST_CASES_FOLDER_PATH, 'simple-variables'),
      ['src/index.ts']
    );
    expect(rootPath).to.exist('string');
    expect(cleanup).to.exist('string');
    expect(program).to.exist('string');
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
  public async 'Test case actually exists on disk, and is a folder'() {
    const { rootPath, cleanup } = await setupTestCaseFolder(
      path.join(TEST_CASES_FOLDER_PATH, 'simple-variables')
    );
    expect(fs.existsSync(rootPath), 'exists').to.equal(true);
    expect(fs.statSync(rootPath).isDirectory(), 'is a directory').to.equal(true);
  }

  @test
  public async 'Cleanup function removes test case from disk'() {
    const { rootPath, cleanup } = await setupTestCaseFolder(
      path.join(TEST_CASES_FOLDER_PATH, 'simple-variables')
    );
    expect(fs.existsSync(rootPath), 'exists').to.equal(true);
    cleanup();
    expect(fs.existsSync(rootPath), 'exists').to.equal(false);
  }
}
