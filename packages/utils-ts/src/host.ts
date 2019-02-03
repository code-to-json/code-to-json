/**
 * An abstraction of the host environment that code-to-json is running on
 * @public
 */
export default interface SysHost {
  /**
   * Synchronously read a file
   *
   * @param filePath path of the file to read
   * @param encoding file encoding
   */
  readFileSync(filePath: string, encoding?: string): string | undefined;

  /**
   * Synchronously write a file
   *
   * @param filePath path of the file to write
   * @param contents file encoding
   */
  writeFileSync(filePath: string, contents: string): void;

  /**
   * Calculate the relative path from one location the host filesystem to another
   *
   * @param from origin of relative path
   * @param to destination of relative path
   */
  pathRelativeTo(from: string, to: string): string;

  /**
   * Combine multiple paths (similar in concept to Node's `path.join` )
   *
   * @param paths paths to combine
   */
  combinePaths(...paths: string[]): string;

  /**
   * Normalize a filesystem path
   *
   * @param path path to normalize
   */
  normalizePath(path: string): string;

  /**
   * Create a temporary folder, returning its name and a callback
   * to remove the folder and all of its contents
   */
  createTempFolder(): {
    name: string;
    cleanup(): void;
  };

  /**
   * Create a new folder
   *
   * @param path path of the folder to create
   */
  createFolder(path: string): void;

  /**
   * Check whether a given path refers to a folder
   *
   * @param path path to check
   */
  isFolder(path: string): boolean;

  /**
   * Check whether a given path refers to a file
   *
   * @param path path to check
   */
  isFile(path: string): boolean;

  /**
   * Remove a folder and all of its contents from the filesystem
   *
   * @param path path of folder to remove
   */
  removeFolderAndContents(path: string): Promise<void>;

  /**
   * Check whether a file or folder exists at the provided path
   *
   * @param path path of file or folder to check
   */
  fileOrFolderExists(path: string): boolean;
}
