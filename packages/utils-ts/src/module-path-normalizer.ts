import SysHost from './host';

export interface ProjectInfo {
  path: string;
  name: string;
  main?: string;
}

export interface ModuleInfo {
  /**
   * Path of file as read on diek
   */
  originalFileName: string;
  relativePath: string;
  moduleName: string;
  extension: string | null;
}

export interface ModulePathNormalizer {
  filePathToModuleInfo(filePath: string): ModuleInfo;
}

export const PASSTHROUGH_MODULE_PATH_NORMALIZER: ModulePathNormalizer = {
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

export function generateModulePathNormalizer(
  host: SysHost,
  project?: ProjectInfo,
): ModulePathNormalizer {
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
          if (absMain === originalFileName) {
            moduleName = name;
          } else {
            moduleName = host.combinePaths(name, fileInSrc);
          }
          relativePath = host.combinePaths(relativeSrc, fileInSrc);
        }
      }
      return {
        originalFileName,
        relativePath,
        moduleName,
        extension,
      };
    },
  };
}
