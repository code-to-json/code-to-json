import { copy, existsSync, statSync } from 'fs-extra';
import * as tmp from 'tmp';

interface TestCase {
  rootPath: string;
  cleanup: () => void;
}

function createDir(): Promise<TestCase> {
  return new Promise((res, rej) => {
    tmp.dir({ template: '/tmp/c2j-test-XXXXXXX' }, (err, path, cleanup) => {
      if (!err) {
        res({ rootPath: path, cleanup });
      } else {
        rej(err);
      }
    });
  });
}

export async function setupTestCase(casePath: string): Promise<TestCase> {
  const { rootPath, cleanup } = await createDir();
  if (!existsSync(casePath)) {
    throw new Error(`Path "${casePath}" does not exist`);
  }

  if (!statSync(casePath).isDirectory) {
    throw new Error(`"${casePath}" is not a directory`);
  }
  copy(casePath, rootPath, {
    errorOnExist: true
  });
  return {
    rootPath,
    cleanup
  };
}
