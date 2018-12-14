import * as ts from 'typescript';

/**
 * Describes a collection of files and folders on disk
 *
 * ```ts
 * const myFixture: FixtureFileContent = {
 *  'package.json': `{
 *    "name": "my-package",
 *    "description": "a new NPM package",
 *    "version": "0.0.1",
 *    "devDependencies": { }
 *   }`,
 *   src: {
 *     'index.ts': `import * as fs from 'fs';
 * const data = fs.readFileSync('my-file.txt');`
 *   }
 * }
 * ```
 */
export interface FixtureFolder {
  [k: string]: FixtureFolder | FixtureFileContent;
}
export type FixtureFileContent = string;
/**
 * A collection of files and folders set up in
 * the system temp folder for the purposes of testing
 */
export interface TestCaseFolder {
  /**
   * Path where the test case exists on disk
   */
  rootPath: string;
  /**
   * Delete the test case when it's no longer needed
   */
  cleanup: () => void;
  /**
   * A string representation of the test case, similar
   * to the linux `tree` command
   */
  toString: () => string;
}

/**
 * A test case folder that has been initialized as
 * a TypeScript program
 */
export interface TestCase extends TestCaseFolder {
  program: ts.Program;
}
