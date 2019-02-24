import { setupTestCase } from '@code-to-json/test-helpers';
import { expect } from 'chai';
import { spawnSync, SpawnSyncReturns } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it } from 'mocha';

function runCli(args?: string[]): SpawnSyncReturns<Buffer> {
  return spawnSync('./bin/code-to-json', args, { shell: true });
}

/**
 * Something is wrong with azure-CI -- I dont' have time to look at it now
 * and have manually verified that these things work in win10 cmd.exe
 *
 * details: https://github.com/code-to-json/code-to-json/issues/83
 */

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

if (!process.env.AZURE_HTTP_USER_AGENT) {
  describe('CLI tests', () => {
    it('--help prints out usage information', async () => {
      expect(
        runCli(['--help'])
          .stdout.toString()
          .trim(),
      ).contains('Usage: code-to-json [options] [entries...]');
    });

    it('failure to specify where project exists provides appropriate feedback', async () => {
      expect(
        runCli()
          .stderr.toString()
          .trim(),
      ).contains('Either --project <path> or entries glob(s) must be defined');
    });

    it('tsconfig-driven project', async () => {
      const testCase = await setupTestCase(SAMPLE_PROJECT_CODE, ['src/index.ts']);
      const { rootPath, cleanup } = testCase;
      expect(rootPath).to.have.length.greaterThan(5);
      runCli(['--project', rootPath, '--out', path.join(rootPath, 'out')]);
      expect(fs.statSync(path.join(rootPath, 'out')).isDirectory()).to.eq(
        true,
        'output subdirectory exists',
      );
      const formattedStat = fs.statSync(path.join(rootPath, 'out', 'formatted.json'));
      expect(formattedStat.isFile()).to.eq(true, 'formatted JSON exists');
      expect(formattedStat.size).to.be.gt(100, 'formatted JSON is not empty');

      cleanup();
    });

    it('glob-driven project', async () => {
      const testCase = await setupTestCase(SAMPLE_PROJECT_CODE, ['src/index.ts']);
      const { rootPath, cleanup } = testCase;
      expect(rootPath).to.have.length.greaterThan(5);
      runCli(['--out', path.join(rootPath, 'out'), path.join(rootPath, 'src/*')]);
      expect(fs.statSync(path.join(rootPath, 'out')).isDirectory()).to.eq(
        true,
        'output subdirectory exists',
      );
      const formattedStat = fs.statSync(path.join(rootPath, 'out', 'formatted.json'));
      expect(formattedStat.isFile()).to.eq(true, 'formatted JSON exists');
      expect(formattedStat.size).to.be.gt(100, 'formatted JSON is not empty');
      cleanup();
    });

    it('--format=raw emits raw data instead of formatted data', async () => {
      const testCase = await setupTestCase(SAMPLE_PROJECT_CODE, ['src/index.ts']);
      const { rootPath, cleanup } = testCase;
      expect(rootPath).to.have.length.greaterThan(5);
      runCli([
        '--format',
        'raw',
        '--out',
        path.join(rootPath, 'out'),
        path.join(rootPath, 'src/*'),
      ]);
      expect(fs.statSync(path.join(rootPath, 'out')).isDirectory()).to.eq(
        true,
        'output subdirectory exists',
      );
      const rawStat = fs.statSync(path.join(rootPath, 'out', 'raw.json'));
      expect(rawStat.isFile()).to.eq(true, 'raw JSON exists');
      expect(rawStat.size).to.be.gt(100, 'raw JSON is not empty');
      cleanup();
    });
  });
}
