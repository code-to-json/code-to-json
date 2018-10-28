import { suite, test } from 'mocha-typescript';
import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs';
import { setupTestCase } from '../src/index';

export const TEST_CASES_FOLDER_PATH = path.join(__dirname, '..', 'test-cases');

@suite
class TestCaseCreation {
  @test
  public async 'Create a new test case from a template'() {
    let { rootPath, cleanup } = await setupTestCase(path.join(TEST_CASES_FOLDER_PATH, 'simple-variables'));
    expect(rootPath).to.exist;
    expect(cleanup).to.exist;
    expect(rootPath).length.to.be.greaterThan(0);
    expect(cleanup).to.be.an.instanceOf(Function);
    cleanup();
  }

  @test
  public async 'Test case actually exists on disk, and is a folder'() {
    let { rootPath, cleanup } = await setupTestCase(path.join(TEST_CASES_FOLDER_PATH, 'simple-variables'));
    expect(fs.existsSync(rootPath), 'exists').to.be.true;
    expect(fs.statSync(rootPath).isDirectory(), 'is a directory').to.be.true;
  }

  @test
  public async 'Cleanup function removes test case from disk'() {
    let { rootPath, cleanup } = await setupTestCase(path.join(TEST_CASES_FOLDER_PATH, 'simple-variables'));
    expect(fs.existsSync(rootPath), 'exists').to.be.true;
    cleanup();
    expect(fs.existsSync(rootPath), 'exists').to.be.false;
  }
}
