/* eslint-disable prefer-rest-params */

import * as ts from 'typescript';

const tsany = ts as any;

// https://github.com/Microsoft/TypeScript/blob/v2.1.4/src/compiler/core.ts#L1368-L1370
export function getDirectoryPath(path: ts.Path): ts.Path;
export function getDirectoryPath(path: string): string;
export function getDirectoryPath(this: any): string | ts.Path {
  return tsany.getDirectoryPath.apply(this, arguments);
}

// https://github.com/Microsoft/TypeScript/blob/v2.2.1/src/compiler/core.ts#L1628
export function combinePaths(path1: string, path2: string): string {
  return tsany.combinePaths(path1, path2);
}

// https://github.com/Microsoft/TypeScript/blob/v2.2.1/src/compiler/core.ts#L1418
export function normalizePath(path: string): string {
  return tsany.normalizePath(path);
}
