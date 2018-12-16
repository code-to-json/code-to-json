import { forEachChild, Node } from 'typescript';

/**
 * Map over a TypeScript AST node's children
 * @param node parent node
 * @param mapper mapping function to apply to each child
 */
export function mapChildren<T>(node: Node, mapper: (child: Node) => T): T[] {
  const arr: T[] = [];
  forEachChild(node, (child: Node) => {
    arr.push(mapper(child));
  });
  return arr;
}
