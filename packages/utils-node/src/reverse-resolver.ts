import {
  createReverseResolver,
  PASSTHROUGH_REVERSE_RESOLVER,
  ReverseResolver,
  SysHost,
} from '@code-to-json/utils-ts';
import { findPkgJson } from './package-json';

/**
 * Create a {@link ReverseResolver} for a project at the specified path
 *
 * @param project path to project (containing `tsconfig.json`, `package.json`)
 * @param host runtime host
 * @public
 */
export async function createReverseResolverForProject(
  project: string,
  host: SysHost,
): Promise<ReverseResolver> {
  if (typeof project !== 'string') {
    throw new Error(`invalid project path: ${JSON.stringify(project)}`);
  }
  const pkg = await findPkgJson(project);
  let pathNormalizer = PASSTHROUGH_REVERSE_RESOLVER;
  if (pkg) {
    pathNormalizer = createReverseResolver(host, {
      path: pkg.path,
      main: pkg.contents['doc:main'] || pkg.contents.main,
      name: pkg.contents.name,
    });
  }
  return pathNormalizer;
}
