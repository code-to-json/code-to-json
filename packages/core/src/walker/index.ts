import { Declaration, Node, Program, SourceFile, Symbol as Sym, Type } from 'typescript';
import { create as createQueue } from '../processing-queue';
import {
  DeclarationRef,
  NodeRef,
  SourceFileRef,
  SymbolRef,
  TypeRef
} from '../processing-queue/ref';
import serializeDeclaration, { SerializedDeclaration } from '../serializers/declaration';
import serializeNode, { SerializedNode } from '../serializers/node';
import serializeSourceFile, { SerializedSourceFile } from '../serializers/source-file';
import serializeSymbol, { SerializedSymbol } from '../serializers/symbol';
import serializeType, { SerializedType } from '../serializers/type';
import createWalkerOptions, { IWalkerOptionArgs } from './options';

import * as pkg from '../../../package';

export interface WalkerOutputData {
  symbol: { [k: string]: Readonly<SerializedSymbol> };
  type: { [k: string]: Readonly<SerializedType> };
  node: { [k: string]: Readonly<SerializedNode> };
  declaration: { [k: string]: Readonly<SerializedDeclaration> };
  sourceFile: { [k: string]: Readonly<SerializedSourceFile> };
}
export interface WalkerOutputMetadata {
  versions: {
    core: string;
  };
  format: 'raw';
}
export interface WalkerOutput {
  codeToJson: WalkerOutputMetadata;
  data: WalkerOutputData;
}

/**
 * Walk a typescript program, using specified entry points, returning
 * JSON information describing the code
 */
export function walkProgram(
  program: Program,
  options: Partial<IWalkerOptionArgs> = {}
): WalkerOutput {
  const opts = createWalkerOptions(options);
  // Create the type-checker
  const checker = program.getTypeChecker();

  // Get all non-declaration source files
  const sourceFiles = program.getSourceFiles().filter(opts.shouldIncludeSourceFile);

  // Initialize the work-processing queue
  const q = createQueue();
  sourceFiles.forEach(sf => {
    return q.queue(sf, 'sourceFile', checker);
  });

  const data = q.drain({
    handleNode(ref: NodeRef, item: Node): SerializedNode {
      return serializeNode(item, checker, ref, q);
    },
    handleType(ref: TypeRef, item: Type): SerializedType {
      return serializeType(item, checker, ref, q);
    },
    handleSourceFile(ref: SourceFileRef, item: SourceFile): SerializedSourceFile {
      return serializeSourceFile(item, checker, ref, q);
    },
    handleSymbol(ref: SymbolRef, item: Sym): SerializedSymbol {
      return serializeSymbol(item, checker, ref, q);
    },
    handleDeclaration(ref: DeclarationRef, item: Declaration): SerializedDeclaration {
      return serializeDeclaration(item, checker, ref, q);
    }
  });
  return {
    codeToJson: {
      versions: {
        core: pkg.version
      },
      format: 'raw'
    },
    data
  };
}
