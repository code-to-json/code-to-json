import SysHost from './host';

/**
 * @private
 */
export interface ProjectInfo {
  path: string;
  name: string;
  main?: string;
}

/**
 * @private
 */
export interface ModuleInfo {
  /**
   * Path of file as read on diek
   */
  originalFileName: string;
  relativePath: string;
  moduleName: string;
  extension: string | null;
}

/**
 * @private
 */
export interface ReverseResolver {
  filePathToModuleInfo(filePath: string): ModuleInfo;
}

/**
 * @private
 */
export const PASSTHROUGH: ReverseResolver = {
  filePathToModuleInfo(originalFileName: string): ModuleInfo {
    const dotIdx = originalFileName.lastIndexOf('.');
    const extension = dotIdx > 0 ? originalFileName.substr(dotIdx + 1) : null;
    const moduleName = dotIdx > 0 ? originalFileName.substr(0, dotIdx) : originalFileName;

    return {
      originalFileName,
      relativePath: moduleName,
      moduleName,
      extension,
    };
  },
};
Object.assign(PASSTHROUGH, { __passthroughNormalizer: true });

/**
 * Create a reverse resolver based on a project
 *
 * @param host system host
 * @param project project information
 * @private
 */
export function createReverseResolver(host: SysHost, project?: ProjectInfo): ReverseResolver {
  return {
    filePathToModuleInfo(originalFileName: string): ModuleInfo {
      const dotIdx = originalFileName.lastIndexOf('.');
      const extension = dotIdx > 0 ? originalFileName.substr(dotIdx + 1) : null;
      let moduleName = dotIdx > 0 ? originalFileName.substr(0, dotIdx) : originalFileName;
      let relativePath = moduleName;
      if (typeof project !== 'undefined') {
        const { path, name, main } = project;
        if (typeof main === 'undefined') {
          relativePath = host.pathRelativeTo(path, moduleName);
          moduleName = host.combinePaths(name, relativePath);
        } else {
          const absMain = host.combinePaths(path, main);
          const srcFolder = host.combinePaths(absMain, '..');
          const relativeSrc = host.pathRelativeTo(path, srcFolder);
          const fileInSrc = host.pathRelativeTo(srcFolder, relativePath);
          if (host.normalizePath(absMain) === host.normalizePath(originalFileName)) {
            moduleName = name;
          } else {
            moduleName = host.combinePaths(name, fileInSrc);
          }
          relativePath = host.combinePaths(relativeSrc, fileInSrc);
        }
      }
      return {
        originalFileName,
        relativePath: host.normalizePath(relativePath),
        moduleName: host.normalizePath(moduleName),
        extension,
      };
    },
  };
}
