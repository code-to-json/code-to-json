import * as debug from 'debug';
import * as fs from 'fs';
import { copy, existsSync, statSync } from 'fs-extra';
import { tmpdir } from 'os';
import * as path from 'path';
import * as tmp from 'tmp';
import { asTree, TreeObject } from 'treeify';
import { asObject as folderAsObject } from './dir-tree';
import { UnreachableError } from './errors';

const log = debug('code-to-json:test-helpers');

export type TestCaseFixtureFileContent = string;

export interface TestCaseFixtureFolder {
  [k: string]: TestCaseFixtureFolder | TestCaseFixtureFileContent;
}

export interface TestCaseFolder {
  rootPath: string;
  tree: () => TreeObject;
  cleanup: () => void;
}

tmp.setGracefulCleanup();

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
          res({ rootPath, tree: () => folderAsObject(rootPath), cleanup });
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
 * @param cse path to test case fixture
 * @public
 */
export async function setupTestCaseFolder(
  cse: string | TestCaseFixtureFolder
): Promise<TestCaseFolder> {
  if (typeof cse === 'string') {
    return setupTestCaseFolderByPath(cse);
  } else if (typeof cse === 'object') {
    return setupTestCaseFolderByObj(cse);
  } else {
    throw new UnreachableError(cse);
  }
}

function createFixtureFile(
  rootPath: string,
  subPath: string,
  content: TestCaseFixtureFileContent
): void {
  fs.writeFileSync(path.join(rootPath, subPath), content);
}

function createFixtureFolder(
  rootPath: string,
  subPath: string,
  caseFixture: TestCaseFixtureFolder
): void {
  for (const f in caseFixture) {
    if (caseFixture.hasOwnProperty(f)) {
      const item = caseFixture[f];
      const itemPath = path.join(subPath, f);
      if (typeof item === 'object') {
        // folder
        fs.mkdirSync(path.join(rootPath, itemPath));
        createFixtureFolder(rootPath, itemPath, item);
      } else if (typeof item === 'string') {
        // file
        createFixtureFile(rootPath, itemPath, item);
      } else {
        throw new UnreachableError(item);
      }
    }
  }
}

async function setupTestCaseFolderByObj(
  caseFixture: TestCaseFixtureFolder
): Promise<TestCaseFolder> {
  const { rootPath, cleanup, tree } = await createDir();
  createFixtureFolder(rootPath, '', caseFixture);

  return {
    tree,
    cleanup,
    rootPath
  };
}

async function setupTestCaseFolderByPath(casePath: string): Promise<TestCaseFolder> {
  const { rootPath, cleanup, tree } = await createDir();
  if (!existsSync(casePath)) {
    throw new Error(`Path "${casePath}" does not exist`);
  }

  if (!statSync(casePath).isDirectory) {
    throw new Error(`"${casePath}" is not a directory`);
  }
  await copy(casePath, rootPath, {
    errorOnExist: true
  });

  if (!existsSync(rootPath)) {
    throw new Error(`Path "${rootPath}" does not exist`);
  }

  log(`Created test case from fixture "${casePath}"
${rootPath}
${asTree(tree(), false, true)}`);
  return {
    tree,
    rootPath,
    cleanup
  };
}
