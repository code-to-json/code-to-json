/* eslint-disable no-undef */
import * as ts from 'typescript';

abstract class SysHost {
  public abstract readFileSync(filePath: string, encoding?: string): string | undefined;

  public abstract writeFileSync(filePath: string, contents: string): void;

  public abstract directoryExists(dirPath: string): boolean;

  public abstract fileExists(filePath: string): boolean;

  public abstract pathRelativeTo(a: string, relativeTo: string): string;

  public abstract combinePaths(...paths: string[]): string;
}

export default SysHost;
