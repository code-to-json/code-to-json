import { createRegistry, RefFor } from '@code-to-json/utils';
import { refId } from '@code-to-json/utils/lib/deferred-processing/ref';
import {
  Declaration,
  Node,
  SourceFile,
  Symbol as Sym,
  Type,
  TypeChecker,
  TypeFormatFlags
} from 'typescript';
import { EntityMap } from '../types';
import { generateId } from './generate-id';
import { DeclarationRef, NodeRef, SourceFileRef, SymbolRef, TypeRef } from './ref';
export interface QueueSink<S, T, N, D, SF> {
  handleNode(ref: NodeRef, item: Node): N;
  handleType(ref: TypeRef, item: Type): T;
  handleDeclaration(ref: DeclarationRef, item: Declaration): D;
  handleSymbol(ref: SymbolRef, item: Sym): S;
  handleSourceFile(ref: SourceFileRef, item: SourceFile): SF;
}

export interface DrainOutput<S, T, N, D, SF> {
  symbol: { [k: string]: S };
  type: { [k: string]: T };
  node: { [k: string]: N };
  declaration: { [k: string]: D };
  sourceFile: { [k: string]: SF };
}

export interface ProcessingQueue {
  queue<K extends keyof EntityMap>(
    thing: EntityMap[K],
    refType: K,
    checker: TypeChecker
  ): RefFor<K> | undefined;
  drain<S, T, N, D, SF>(sink: Partial<QueueSink<S, N, T, D, SF>>): DrainOutput<S, N, T, D, SF>;
}

interface RefTracking<K extends keyof EntityMap> {
  ref: RefFor<K>;
  processed: boolean;
}

interface ProcessingData {
  symbol: Map<Sym, RefTracking<'symbol'>>;
  type: Map<Type, RefTracking<'type'>>;
  declaration: Map<Declaration, RefTracking<'declaration'>>;
  node: Map<Node, RefTracking<'node'>>;
  sourceFile: Map<SourceFile, RefTracking<'sourceFile'>>;
}

/**
 * Create a new processing queue
 */
export function create(): ProcessingQueue {
  const registries = {
    node: createRegistry('node', generateId),
    symbol: createRegistry('symbol', generateId),
    type: createRegistry('type', generateId),
    sourceFile: createRegistry('sourceFile', generateId),
    declaration: createRegistry('declaration', generateId)
  };

  return {
    queue<K extends keyof EntityMap>(
      thing: EntityMap[K],
      refType: K,
      checker: TypeChecker
    ): RefFor<K> | undefined {
      switch (refType) {
        case 'declaration':
          return registries.declaration.getOrCreateReference(thing);
        case 'symbol':
          return registries.symbol.getOrCreateReference(thing);
        case 'type':
          return registries.type.getOrCreateReference(thing);
        case 'node':
          return registries.node.getOrCreateReference(thing);
        case 'sourceFile':
          return registries.sourceFile.getOrCreateReference(thing);
      }
    },
    drain<S, T, N, D, SF>(sink: Partial<QueueSink<S, N, T, D, SF>>): DrainOutput<S, N, T, D, SF> {
      const out: DrainOutput<S, N, T, D, SF> = {
        declaration: {},
        symbol: {},
        type: {},
        node: {},
        sourceFile: {}
      };
      /**
       * Flush any un-processed items from the processing queue to the drain output
       */
      function flush<K extends keyof EntityMap>(): { processed: number } {
        const outputInfo = {
          processed: 0
        };
        const { handleDeclaration, handleNode, handleSourceFile, handleType, handleSymbol } = sink;
        if (handleSourceFile) {
          outputInfo.processed += registries.sourceFile.drain((ref, item) => {
            const sf = handleSourceFile(ref, item as SourceFile);
            out.sourceFile[refId(ref)] = sf;
          }).processedCount;
        }
        if (handleDeclaration) {
          outputInfo.processed += registries.declaration.drain((ref, item) => {
            const d = handleDeclaration(ref, item as Declaration);
            out.declaration[refId(ref)] = d;
          }).processedCount;
        }
        if (handleSymbol) {
          outputInfo.processed += registries.symbol.drain((ref, item) => {
            const d = handleSymbol(ref, item as Sym);
            out.symbol[refId(ref)] = d;
          }).processedCount;
        }
        if (handleNode) {
          outputInfo.processed += registries.node.drain((ref, item) => {
            const d = handleNode(ref, item as Node);
            out.node[refId(ref)] = d;
          }).processedCount;
        }
        if (handleType) {
          outputInfo.processed += registries.type.drain((ref, item) => {
            const d = handleType(ref, item as Type);
            out.type[refId(ref)] = d;
          }).processedCount;
        }

        return outputInfo;
      }
      const maxLoops = 60;
      let flushCount = 1;
      let lastResult = flush();
      while (lastResult.processed > 0 && flushCount < maxLoops) {
        // tslint:disable-next-line:no-console
        console.log(`(${flushCount}) Processed: ${lastResult.processed} things`);
        lastResult = flush();
        flushCount++;
      }
      // tslint:disable-next-line:no-console
      console.log(`(${flushCount} - final) Processed: ${lastResult.processed} things`);
      return out;
    }
  };
}
