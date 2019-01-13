import { SysHost } from '@code-to-json/utils-ts';
import { Declaration, Node, Program, SourceFile, Symbol as Sym, Type } from 'typescript';
import Collector from '../collector';
import { create as createQueue } from '../processing-queue';
import {
  DeclarationRef,
  NodeRef,
  SourceFileRef,
  SymbolRef,
  TypeRef,
} from '../processing-queue/ref';
import serializeDeclaration, { SerializedDeclaration } from '../serializers/declaration';
import serializeNode, { SerializedNode } from '../serializers/node';
import serializeSourceFile, { SerializedSourceFile } from '../serializers/source-file';
import serializeSymbol, { SerializedSymbol } from '../serializers/symbol';
import serializeType, { SerializedBuiltInType, SerializedType } from '../serializers/type';
import { createWalkerConfig, populateWalkerOptions, WalkerOptions } from './options';

export interface WalkerOutputData {
  symbols: { [k: string]: Readonly<SerializedSymbol> };
  types: { [k: string]: Readonly<SerializedType> };
  nodes: { [k: string]: Readonly<SerializedNode> };
  declarations: { [k: string]: Readonly<SerializedDeclaration> };
  sourceFiles: { [k: string]: Readonly<SerializedSourceFile> };
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
  host: SysHost,
  options: Partial<WalkerOptions> = {},
): WalkerOutput {
  const opts = populateWalkerOptions(options);
  const cfg = createWalkerConfig(opts);
  // Create the type-checker
  const checker = program.getTypeChecker();

  // Get all non-declaration source files
  const sourceFiles = program.getSourceFiles().filter(cfg.shouldIncludeSourceFile);

  // Initialize the work-processing queue
  const queue = createQueue(checker);
  sourceFiles.forEach(sf => queue.queue(sf, 'sourceFile', checker));
  const collector: Collector = {
    queue,
    host,
    opts,
    pathNormalizer: opts.pathNormalizer,
  };
  const data = queue.drain({
    handleNode(ref: NodeRef, item: Node): SerializedNode {
      return serializeNode(item, checker, ref, collector);
    },
    handleType(ref: TypeRef, item: Type): SerializedType {
      return serializeType(item, checker, ref, collector);
    },
    handleSourceFile(ref: SourceFileRef, item: SourceFile): SerializedSourceFile {
      return serializeSourceFile(item, checker, ref, collector);
    },
    handleSymbol(ref: SymbolRef, item: Sym): SerializedSymbol {
      return serializeSymbol(item, checker, ref, collector);
    },
    handleDeclaration(ref: DeclarationRef, item: Declaration): SerializedDeclaration {
      return serializeDeclaration(item, checker, ref, collector);
    },
  });
  return {
    codeToJson: {
      versions: {
        core: 'pkg.version',
      },
      format: 'raw',
    },
    data,
  };
}
