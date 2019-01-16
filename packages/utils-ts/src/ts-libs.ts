/**
 * Given an absolute file path, determine the name of its
 * ts built-in library
 *
 * @param fileName absolute path to a source file
 *
 * @example
 * ```ts
 * getTsLibFilename('/Users/mike/foo/bar/node_modules/typescript/lib/lib.es5.d.ts'); // 'lib.es5.d.ts'
 * getTsLibFilename('/Users/mike/foo/bar/index.ts'); // undefined
 * ```
 */
export function getTsLibFilename(fileName: string): string | undefined {
  const [, libName] = fileName.split(/\/node_modules\/typescript\/lib\//);
  return typeof libName !== 'undefined' && libName.endsWith('.d.ts') ? libName : undefined;
}
