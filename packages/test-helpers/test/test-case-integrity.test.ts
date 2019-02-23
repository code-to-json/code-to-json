import { expect } from 'chai';
import * as fs from 'fs-extra';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';

const TEST_CASES_FOLDER_PATH = path.join(__dirname, '..', 'test-cases');

const TEST_CASE_FOLDERS = fs
  // all things in the folder
  .readdirSync(TEST_CASES_FOLDER_PATH)
  // that are directories
  .filter(p => fs.statSync(path.join(TEST_CASES_FOLDER_PATH, p)).isDirectory())
  // and transformed into absolute paths
  .map(f => path.join(TEST_CASES_FOLDER_PATH, f));

@suite
export class TestCaseIntegrity {
  @test
  public async 'every test case has a tsconfig.json file'(): Promise<void> {
    // each test case
    const offenders = TEST_CASE_FOLDERS.filter(projectRoot => {
      // this should be the path of tsconfig.json
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
      // make sure it's a file and exists
      if (fs.existsSync(tsconfigPath) && fs.statSync(tsconfigPath).isFile()) {
        return false;
      }
      return true;
    });
    expect(offenders.join(',')).to.eq('');
  }

  @test
  public async 'every test case has a src folder'(): Promise<void> {
    // each test case
    const offenders = TEST_CASE_FOLDERS.filter(projectRoot => {
      // should be the path of the src folder
      const srcPath = path.join(projectRoot, 'src');
      // make sure it's a folder and exists
      if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) {
        return false;
      }
      return true;
    });
    expect(offenders.join(',')).to.eq('');
  }

  @test
  public async 'every test case has a src/index.ts or src/index.js file'(): Promise<void> {
    // each test case
    const offenders = TEST_CASE_FOLDERS.filter(projectRoot => {
      // this should be the index.ts file
      const indexPath = path.join(projectRoot, 'src', 'index.ts');
      // make sure it's a file and exists
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
        return false;
      }
      return true;
    });
    expect(offenders.join(',')).to.eq('');
  }
}
