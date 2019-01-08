import * as path from 'path';
import * as ts from 'typescript';
import { SysHost } from '../src/index';

export class NodeHost extends SysHost {
  public readFileSync(filePath: string, encoding?: string): string | undefined {
    return ts.sys.readFile(filePath, encoding);
  }

  public writeFileSync(filePath: string, contents: string): void {
    return ts.sys.writeFile(filePath, contents);
  }

  public directoryExists(dirPath: string): boolean {
    return ts.sys.directoryExists(dirPath);
  }

  public fileExists(filePath: string): boolean {
    return ts.sys.fileExists(filePath);
  }

  public pathRelativeTo(from: string, to: string): string {
    return path.relative(from, to);
  }

  public combinePaths(...paths: string[]): string {
    return path.join(...paths);
  }

  public normalizePath(pth: string): string {
    return path.normalize(pth).replace(/\\/g, '/');
  }
}
