import * as ts from 'typescript';

export function mapChildren<T>(
  node: ts.Node,
  mapper: (child: ts.Node) => T
): T[] {
  const arr: T[] = [];
  ts.forEachChild(node, (child: ts.Node) => {
    arr.push(mapper(child));
  });
  return arr;
}
