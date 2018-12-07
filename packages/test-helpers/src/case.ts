import * as debug from 'debug';
import * as fs from 'fs';
import { copy, existsSync, statSync } from 'fs-extra';
import { tmpdir } from 'os';
import * as path from 'path';
import * as tmp from 'tmp';
import * as ts from 'typescript';

const log = debug('code-to-json:test-helpers');

tmp.setGracefulCleanup();

export interface TestCaseFolder {
  rootPath: string;
  cleanup: () => void;
}

export interface TestCase {
  rootPath: string;
  program: ts.Program;
  cleanup: () => void;
}

/**
 * Create a temporary folder
 */
function createDir(): Promise<TestCaseFolder> {
  return new Promise((res, rej) => {
    tmp.dir(
      {
        dir: tmpdir(),
        unsafeCleanup: true // delete temp folder even if it's non-empty
      },
      (err, rootPath, cleanup) => {
        if (!err) {
          res({ rootPath, cleanup });
        } else {
          rej(err);
        }
      }
    );
  });
}

/**
 * Create a new test case from fixture files on disk
 *
 * @param casePath path to test case fixture
 * @public
 */
export async function setupTestCaseFolder(casePath: string): Promise<TestCaseFolder> {
  const { rootPath, cleanup } = await createDir();
  log(`created temporary folder "${rootPath}" from fixture "${casePath}"`);
  if (!existsSync(casePath)) {
    throw new Error(`Path "${casePath}" does not exist`);
  }

  if (!statSync(casePath).isDirectory) {
    throw new Error(`"${casePath}" is not a directory`);
  }
  await copy(casePath, rootPath, {
    errorOnExist: true
  });
  return {
    rootPath,
    cleanup
  };
}
/**
 * Create a new test case from fixture files on disk
 *
 * @param casePath path to test case fixture
 * @public
 */
export async function setupTestCase(casePath: string): Promise<TestCase> {
  const { rootPath, cleanup } = await setupTestCaseFolder(casePath);
  if (!fs.existsSync(rootPath)) {
    throw new Error(`"${rootPath}" does not exist`);
  }
  if (!fs.statSync(rootPath).isDirectory) {
    throw new Error(`"${rootPath}" is not a folder`);
  }
  const entry = path.join(rootPath, 'src', 'index.ts');
  if (!fs.statSync(entry).isFile) {
    throw new Error(`"${entry}" is not a file`);
  }
  log(`setting up test case for entry "${entry}"`);
  const program = ts.createProgram({
    rootNames: [entry],
    options: {
      allowJs: true,
      noEmit: true,
      moduleResolution: ts.ModuleResolutionKind.NodeJs
    }
  });

  return {
    rootPath,
    cleanup,
    program
  };
}
