import { suite, test } from 'mocha-typescript';
import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs-extra';

const TEST_CASES_FOLDER_PATH = path.join(__dirname, '..', 'test-cases');

const TEST_CASE_FOLDERS =
  fs.readdirSync(TEST_CASES_FOLDER_PATH) // all things in the folder
  .filter(p => fs.statSync(path.join(TEST_CASES_FOLDER_PATH, p)).isDirectory()) // that are directories
  .map(f => path.join(TEST_CASES_FOLDER_PATH, f)); // and transformed into absolute paths

@suite
class TestCaseIntegrity {

  @test
  public async 'every test case has a tsconfig.json file'() {
    // each test case
    const offenders = TEST_CASE_FOLDERS.filter(projectRoot =>  {
      // this should be the path of tsconfig.json
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
      // make sure it's a file and exists
      if (fs.existsSync(tsconfigPath) && fs.statSync(tsconfigPath).isFile()) return false;
      return true;
    });
    expect(offenders.join(',')).to.be.empty;
  }

  @test
  public async 'every test case has a src folder'() {
    // each test case
    const offenders = TEST_CASE_FOLDERS.filter(projectRoot =>  {
      // should be the path of the src folder
      const srcPath = path.join(projectRoot, 'src');
      // make sure it's a folder and exists
      if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) return false;
      return true;
    });
    expect(offenders.join(',')).to.be.empty;
  }

  @test
  public async 'every test case has a src/index.ts or src/index.js file'() {
    // each test case
    const offenders = TEST_CASE_FOLDERS.filter(projectRoot =>  {
      // this should be the index.ts file
      const indexPath = path.join(projectRoot, 'src', 'index.ts');
      // make sure it's a file and exists
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) return false;
      return true;
    });
    expect(offenders.join(',')).to.be.empty;
  }
}
