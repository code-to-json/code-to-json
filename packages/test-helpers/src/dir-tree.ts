import { UnreachableError } from '@code-to-json/utils';
import * as dirTree from 'directory-tree';
import * as treeify from 'treeify';

type DirectoryTree = ReturnType<typeof dirTree>;

function dirTreeAsObject(tree: DirectoryTree, obj: treeify.TreeObject): treeify.TreeObject {
  const { type, name, children } = tree;
  switch (type) {
    case 'file':
      // eslint-disable-next-line no-param-reassign
      obj[name] = '';
      break;
    case 'directory':
      {
        const o = {};
        // eslint-disable-next-line no-param-reassign
        obj[name] = o;
        if (children) {
          children.forEach((ch) => dirTreeAsObject(ch, o));
        }
      }
      break;
    default:
      throw new UnreachableError(type);
  }
  return obj;
}

function dirTreeAsString(tree: DirectoryTree): string {
  const { children } = tree;
  const obj: treeify.TreeObject = {};
  if (!children || children.length === 0) {
    return '(empty)';
  }
  children.forEach((ch) => dirTreeAsObject(ch, obj));
  return treeify.asTree(obj, false, true);
}

export function asString(pth: string): string {
  const tree = dirTree(pth);
  return dirTreeAsString(tree);
}

export function asObject(pth: string): treeify.TreeObject {
  const tree = dirTree(pth);
  const { children } = tree;
  const obj: treeify.TreeObject = {};
  if (!children) {
    return {};
  }
  children.forEach((ch) => dirTreeAsObject(ch, obj));
  return obj;
}
