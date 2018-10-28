import { suite, test } from 'mocha-typescript';
import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs-extra';
import { setupTestCase } from '../src/index';

const TEST_CASES_FOLDER_PATH = path.join(__dirname, '..', 'test-cases');

const TEST_CASE_FOLDERS = fs.readdirSync(TEST_CASES_FOLDER_PATH)
  .filter(p => fs.statSync(path.join(TEST_CASES_FOLDER_PATH, p)).isDirectory())
  .map(f => path.join(TEST_CASES_FOLDER_PATH, f));
  console.log('TEST_CASE_FOLDERS', TEST_CASE_FOLDERS);

@suite
class TestCaseIntegrity {
  @test
  public async 'every test case has a tsconfig.json file'() {
    const offenders = TEST_CASE_FOLDERS.filter(projectRoot =>  {
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
      if (fs.existsSync(tsconfigPath) && fs.statSync(tsconfigPath).isFile()) return false;
      return true;
    });
    expect(offenders.join(',')).to.be.empty;
  }
  @test
  public async 'every test case has a src folder'() {
    const offenders = TEST_CASE_FOLDERS.filter(projectRoot =>  {
      const srcPath = path.join(projectRoot, 'src');
      if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) return false;
      return true;
    });
    expect(offenders.join(',')).to.be.empty;
  }
  @test
  public async 'every test case has a src/index.ts folder'() {
    const offenders = TEST_CASE_FOLDERS.filter(projectRoot =>  {
      const indexPath = path.join(projectRoot, 'src', 'index.ts');
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) return false;
      return true;
    });
    expect(offenders.join(',')).to.be.empty;
  }
}
