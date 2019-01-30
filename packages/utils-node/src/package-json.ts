/* eslint-disable global-require, import/no-dynamic-require */
import * as path from 'path';
import * as pkgup from 'pkg-up';

export async function findPkgJson(
  searchPath: string,
): Promise<{ path: string; contents: any } | undefined> {
  if (typeof searchPath !== 'string') {
    throw new Error(`invalid searchPath: ${JSON.stringify(searchPath)}`);
  }
  const pkg = await pkgup(searchPath);
  if (!pkg) {
    return undefined;
  }
  const pkgJson = require(pkg);
  if ('doc:main' in pkgJson || 'main' in pkgJson) {
    return {
      path: path.join(pkg, '..'),
      contents: pkgJson,
    };
  }
  return { path: path.join(pkg, '..'), contents: pkgJson };
}
