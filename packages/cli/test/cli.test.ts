import { setupTestCase } from '@code-to-json/test-helpers';
import { expect } from 'chai';
import { spawnSync, SpawnSyncReturns } from 'child_process';
import * as fs from 'fs';
import { slow, suite, test, timeout as testTimeout } from 'mocha-typescript';
import * as path from 'path';

const SAMPLE_PROJECT_CODE = {
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
 `,
  },
};

function runCli(args?: string[]): SpawnSyncReturns<string> {
  return spawnSync('./bin/code-to-json', args);
}

@suite
@slow(2000)
class CliTests {
  @test
  public async '--help prints out usage information'(): Promise<void> {
    expect(
      runCli(['--help'])
        .stdout.toString()
        .trim(),
    ).contains('Usage: code-to-json [options] [entries...]');
  }

  @test
  public async 'failure to specify where project exists provides appropriate feedback'(): Promise<
    void
  > {
    expect(
      runCli()
        .stderr.toString()
        .trim(),
    ).contains('[ERROR] - Either --project <path> or entries glob(s) must be defined');
  }

  @test
  public async 'tsconfig-driven project'(): Promise<void> {
    const testCase = await setupTestCase(SAMPLE_PROJECT_CODE, ['src/index.ts']);
    const { rootPath, cleanup } = testCase;
    expect(rootPath).to.have.length.greaterThan(5);
    runCli(['--project', rootPath, '--out', path.join(rootPath, 'out')]);
    expect(fs.statSync(path.join(rootPath, 'out')).isDirectory()).to.eq(
      true,
      'output subdirectory exists',
    );
    const rawStat = fs.statSync(path.join(rootPath, 'out', 'raw.json'));
    const formattedStat = fs.statSync(path.join(rootPath, 'out', 'formatted.json'));
    expect(rawStat.isFile()).to.eq(true, 'raw JSON exists');
    expect(formattedStat.isFile()).to.eq(true, 'formatted JSON exists');
    expect(rawStat.size).to.be.gt(100, 'raw JSON is not empty');
    expect(formattedStat.size).to.be.gt(100, 'formatted JSON is not empty');

    cleanup();
  }

  @test
  public async 'glob-driven project'(): Promise<void> {
    const testCase = await setupTestCase(SAMPLE_PROJECT_CODE, ['src/index.ts']);
    const { rootPath, cleanup } = testCase;
    expect(rootPath).to.have.length.greaterThan(5);
    runCli(['--out', path.join(rootPath, 'out'), path.join(rootPath, 'src/*')]);
    expect(fs.statSync(path.join(rootPath, 'out')).isDirectory()).to.eq(
      true,
      'output subdirectory exists',
    );
    const rawStat = fs.statSync(path.join(rootPath, 'out', 'raw.json'));
    const formattedStat = fs.statSync(path.join(rootPath, 'out', 'formatted.json'));
    expect(rawStat.isFile()).to.eq(true, 'raw JSON exists');
    expect(formattedStat.isFile()).to.eq(true, 'formatted JSON exists');
    expect(rawStat.size).to.be.gt(100, 'raw JSON is not empty');
    expect(formattedStat.size).to.be.gt(100, 'formatted JSON is not empty');
    cleanup();
  }
}
