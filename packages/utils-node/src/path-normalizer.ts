import {
  generateModulePathNormalizer,
  ModulePathNormalizer,
  PASSTHROUGH_MODULE_PATH_NORMALIZER,
  SysHost,
} from '@code-to-json/utils-ts';
import { findPkgJson } from './package-json';

export async function pathNormalizerForPackageJson(
  project: string,
  host: SysHost,
): Promise<ModulePathNormalizer> {
  if (typeof project !== 'string') {
    throw new Error(`invalid project path: ${JSON.stringify(project)}`);
  }
  const pkg = await findPkgJson(project);
  let pathNormalizer = PASSTHROUGH_MODULE_PATH_NORMALIZER;
  if (pkg) {
    pathNormalizer = generateModulePathNormalizer(host, {
      path: pkg.path,
      main: pkg.contents['doc:main'] || pkg.contents.main,
      name: pkg.contents.name,
    });
  }
  return pathNormalizer;
}
