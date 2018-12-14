import * as debug from 'debug';
import * as fs from 'fs';
import { copy, existsSync, statSync } from 'fs-extra';
import { tmpdir } from 'os';
import * as path from 'path';
import * as tmp from 'tmp';
import { asTree, TreeObject } from 'treeify';
import * as ts from 'typescript';
import { asObject as folderAsObject } from './dir-tree';

const log = debug('code-to-json:test-helpers');

tmp.setGracefulCleanup();

export interface TestCaseFolder {
  rootPath: string;
  tree: () => TreeObject;
  cleanup: () => void;
}

export interface TestCase extends TestCaseFolder {
  program: ts.Program;
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
 * @param casePath path to test case fixture
 * @public
 */
export async function setupTestCaseFolder(casePath: string): Promise<TestCaseFolder> {
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

/**
 * Create a new test case from fixture files on disk
 *
 * @param casePath path to test case fixture
 * @public
 */
export async function setupTestCase(casePath: string, entryPaths: string[]): Promise<TestCase> {
  const { rootPath, cleanup, tree } = await setupTestCaseFolder(casePath);
  if (!fs.existsSync(rootPath)) {
    throw new Error(`"${rootPath}" does not exist`);
  }
  if (!fs.statSync(rootPath).isDirectory) {
    throw new Error(`"${rootPath}" is not a folder`);
  }
  const entries = entryPaths.map(pth => path.join(rootPath, pth));
  const entryErrors: { [k: string]: string[] } = {};
  entries.forEach(pth => {
    const localErrors: string[] = [];
    if (!fs.existsSync(pth)) {
      localErrors.push('was not found');
    } else {
      const stats = fs.statSync(pth);
      if (!stats.isFile) {
        localErrors.push('is not a file');
      }
    }
    if (localErrors.length > 0) {
      entryErrors[pth] = localErrors;
    }
  });
  if (Object.keys(entryErrors).length > 0) {
    throw new Error(`One or more problems was detected with the specified entries
${JSON.stringify(entryErrors, null, '  ')}`);
  }
  log(`setting up test case for entries ${entryPaths.map((s: string) => s).join('\n')}`);

  log(`creating typescript program from fixture "${casePath}"
${rootPath}
${asTree(tree(), false, true)}`);
  const program = ts.createProgram({
    rootNames: entries,
    options: {
      allowJs: true,
      noEmit: true,
      moduleResolution: ts.ModuleResolutionKind.NodeJs
    }
  });

  return {
    tree,
    rootPath,
    cleanup,
    program
  };
}
