import * as ts from 'typescript';
import {
  SerializedImportDeclaration,
  WalkData,
  SerializedImportClause,
  SerializedBaseNode,
  SerializedNamedBindings
} from '../types';
import serializeBaseNode from './base';
import serializeIdentifier from './identifier';

export default function serializeImportDeclaration(
  node: ts.ImportDeclaration,
  checker: ts.TypeChecker,
  walkData: WalkData
): SerializedImportDeclaration {
  const { importClause, moduleSpecifier } = node;
  return {
    ...serializeBaseNode(node, checker, walkData),
    moduleSpecifier: moduleSpecifier.getText(),
    importClause:
      importClause && serializeImportClause(importClause, checker, walkData)
  };
}

function serializeNamedBindings(
  node: ts.NamespaceImport | ts.NamedImports,
  checker: ts.TypeChecker,
  walkData: WalkData
): SerializedNamedBindings {
  if (ts.isNamespaceImport(node)) {
    return {
      ...serializeBaseNode(node, checker, walkData)
    };
  } else {
    const { elements } = node;
    return {
      ...serializeBaseNode(node, checker, walkData),
      elements: elements.map(e => {
        return {
          name: e.name.text,
          propertyName: e.propertyName && e.propertyName.text
        };
      })
    };
  }
}

function serializeImportClause(
  node: ts.ImportClause,
  checker: ts.TypeChecker,
  walkData: WalkData
): SerializedImportClause {
  const { namedBindings, name } = node;
  return {
    ...serializeBaseNode(node, checker, walkData),
    name: name && name.text,
    namedBindings:
      namedBindings && serializeNamedBindings(namedBindings, checker, walkData)
  };
}
