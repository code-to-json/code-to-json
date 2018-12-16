import { UnreachableError } from '@code-to-json/utils';
import * as debug from 'debug';
import * as fs from 'fs';
import { copy, existsSync, statSync } from 'fs-extra';
import { tmpdir } from 'os';
import * as path from 'path';
import * as tmp from 'tmp';
import { asTree } from 'treeify';
import { asObject as folderAsObject } from './dir-tree';
import { FixtureFileContent, FixtureFolder, TestCaseFolder } from './types';

const log = debug('code-to-json:test-helpers');

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
          res({
            rootPath,
            toString(): string {
              const t = folderAsObject(rootPath);
              return asTree(t, false, true);
            },
            cleanup
          });
        } else {
          rej(err);
        }
      }
    );
  });
}

function createFixtureFile(rootPath: string, subPath: string, content: FixtureFileContent): void {
  fs.writeFileSync(path.join(rootPath, subPath), content);
}

function createFixtureFolder(rootPath: string, subPath: string, caseFixture: FixtureFolder): void {
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

async function setupTestCaseFolderByObj(caseFixture: FixtureFolder): Promise<TestCaseFolder> {
  const folder = await createDir();
  const { rootPath } = folder;
  createFixtureFolder(rootPath, '', caseFixture);

  return folder;
}

async function setupTestCaseFolderByPath(casePath: string): Promise<TestCaseFolder> {
  const folder = await createDir();
  const { rootPath } = folder;
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
${folder}`);
  return folder;
}

/**
 * Given a fixture or its location, set up files and folders
 * on disk
 *
 * @param cse object representation of the fixture, or a path where it can be found on disk
 * @public
 */
export async function createTempFixtureFolder(
  cse: string | FixtureFolder
): Promise<TestCaseFolder> {
  if (typeof cse === 'string') {
    return setupTestCaseFolderByPath(cse);
  } else if (typeof cse === 'object') {
    return setupTestCaseFolderByObj(cse);
  } else {
    throw new UnreachableError(cse);
  }
}
