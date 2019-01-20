import { UnreachableError } from '@code-to-json/utils';
import { Dict } from '@mike-north/types';
import * as ts from 'typescript';

const tsany = ts as any;

// https://github.com/Microsoft/TypeScript/blob/v2.1.4/src/compiler/core.ts#L1368-L1370
export function getDirectoryPath(path: ts.Path): ts.Path;
export function getDirectoryPath(path: string): string;
export function getDirectoryPath(this: any): string | ts.Path {
  // eslint-disable-next-line prefer-rest-params
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

/**
 * @private
 * @see https://raw.githubusercontent.com/Microsoft/TypeScript/9bd23652ef8c4e6a614a2f27c467b1a68ce3340e/src/compiler/checker.ts
 */
export function getFirstIdentifier(node: ts.EntityNameOrEntityNameExpression): ts.Identifier {
  const { kind } = node;
  switch (kind) {
    case ts.SyntaxKind.Identifier:
      return node as ts.Identifier;
    case ts.SyntaxKind.QualifiedName:
      do {
        // eslint-disable-next-line no-param-reassign
        node = (node as ts.QualifiedName).left;
      } while (node.kind !== ts.SyntaxKind.Identifier);
      return node as ts.Identifier;
    case ts.SyntaxKind.PropertyAccessExpression:
      do {
        // eslint-disable-next-line no-param-reassign
        node = (node as ts.PropertyAccessExpression).expression as any;
      } while (node.kind !== ts.SyntaxKind.Identifier);
      return node as ts.Identifier;
    default:
      throw new UnreachableError(kind);
  }
}

/**
 * @private
 */
export type TypeMapper = (t: ts.TypeParameter) => ts.Type;

/**
 * An instantiated anonymous type has a target and a mapper
 * @private
 */
export interface AnonymousType extends ts.ObjectType {
  target?: AnonymousType; // Instantiation target
  mapper?: TypeMapper; // Instantiation mapper
}

/**
 * @private
 */
export interface MappedType extends AnonymousType {
  declaration: ts.MappedTypeNode;
  typeParameter?: ts.TypeParameter;
  constraintType?: ts.Type;
  templateType?: ts.Type;
  modifiersType?: ts.Type;
  resolvedApparentType?: ts.Type;
  instantiating?: boolean;
}
