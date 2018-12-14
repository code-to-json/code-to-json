import * as dirTree from 'directory-tree';
import * as treeify from 'treeify';
import { UnreachableError } from './errors';

type DirectoryTree = ReturnType<typeof dirTree>;

export function dirTreeAsObject(
  tree: DirectoryTree,
  obj: treeify.TreeObject = {}
): treeify.TreeObject {
  const { type, name, children } = tree;
  switch (type) {
    case 'file':
      obj[name] = '';
      break;
    case 'directory':
      const o = {};
      obj[name] = o;
      if (children) {
        children.forEach(ch => dirTreeAsObject(ch, o));
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
  if (!children) {
    return '(empty)';
  }
  children.forEach(ch => dirTreeAsObject(ch, obj));
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
  children.forEach(ch => dirTreeAsObject(ch, obj));
  return obj;
}

// tslint:disable-next-line:no-commented-code
// const p = path.join(__dirname, '..', 'test-cases', 'simple-variables');
// console.log(asObject(p));
