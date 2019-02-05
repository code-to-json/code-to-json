import { InvalidArgumentsError } from '@code-to-json/utils';
import { createProgramFromEntries } from '@code-to-json/utils-ts';
import * as debug from 'debug';
import * as glob from 'glob';
import * as path from 'path';
import { Program } from 'typescript';
import { promisify } from 'util';

const debugLog = debug('code-to-json:cli');

const pGlob = promisify(glob);

/**
 * Resolve some globs into discrete files, matching a set of extensions
 * @param globs Globs to search
 * @param extensions Extensions of paths to retain
 * @internal
 */
export async function globsToPaths(
  globs: string[],
  extensions: string[] = ['.js', '.ts'],
): Promise<string[]> {
  const valueSet = new Set<string>();
  await Promise.all(
    globs.map((
      g, // for each glob in the list
    ) =>
      pGlob(g) // get the collection of files
        .then((files: string[]) => {
          files.forEach((f) => valueSet.add(f)); // add each file to the set
        })
        .catch((er) => {
          throw new InvalidArgumentsError(`Invalid glob: ${g}\n${er}`);
        }),
    ),
  );
  const allPaths = [...valueSet]; // Set<string> -> string[]
  // If extensions are provided, only return those files that match
  return extensions
    ? allPaths.filter((f) => extensions.indexOf(path.extname(f).toLowerCase()) >= 0)
    : allPaths;
}

/**
 * Create a typescript program from globs that describe entry files
 * @param globs Globs that specify one or more entries
 * @internal
 */
export async function createProgramFromEntryGlobs(globs: string[]): Promise<Program> {
  const rootNames = await globsToPaths(globs);
  debugLog('globs are equivalent to files', rootNames);
  return createProgramFromEntries(rootNames);
}
