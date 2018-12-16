import { createQueue, RefFor, refId, UnreachableError } from '@code-to-json/utils';
import * as debug from 'debug';
import { Declaration, Node, SourceFile, Symbol as Sym, Type, TypeChecker } from 'typescript';
import { EntityMap } from '../types';
import generateId from './generate-id';
import { DeclarationRef, NodeRef, SourceFileRef, SymbolRef, TypeRef } from './ref';

export interface QueueSink<S, T, N, D, SF> {
  handleNode(ref: NodeRef, item: Node): N;
  handleType(ref: TypeRef, item: Type): T;
  handleDeclaration(ref: DeclarationRef, item: Declaration): D;
  handleSymbol(ref: SymbolRef, item: Sym): S;
  handleSourceFile(ref: SourceFileRef, item: SourceFile): SF;
}

const log = debug('code-to-json:processor');

export interface DrainOutput<S, T, N, D, SF> {
  symbol: { [k: string]: S };
  type: { [k: string]: T };
  node: { [k: string]: N };
  declaration: { [k: string]: D };
  sourceFile: { [k: string]: SF };
}

export interface ProcessingQueue {
  queue<K extends keyof EntityMap, E extends EntityMap[K]>(
    thing: E,
    refType: K,
    checker: TypeChecker,
  ): RefFor<K> | undefined;
  drain<S, T, N, D, SF>(sink: Partial<QueueSink<S, N, T, D, SF>>): DrainOutput<S, N, T, D, SF>;
}

/**
 * Create a new processing queue
 */
export function create(): ProcessingQueue {
  const registries = {
    node: createQueue<'node', Node>('node', generateId),
    symbol: createQueue<'symbol', Sym>('symbol', generateId),
    type: createQueue<'type', Type>('type', generateId),
    sourceFile: createQueue<'sourceFile', SourceFile>('sourceFile', generateId),
    declaration: createQueue<'declaration', Declaration>('declaration', generateId),
  };

  return {
    queue<K extends keyof EntityMap>(
      thing: EntityMap[K],
      typ: K,
      _checker: TypeChecker,
    ): RefFor<K> | undefined {
      const refType: keyof EntityMap = typ;
      switch (refType) {
        case 'declaration':
          return registries.declaration.queue(thing as Declaration);
        case 'symbol':
          return registries.symbol.queue(thing as Sym);
        case 'type':
          return registries.type.queue(thing as Type);
        case 'node':
          return registries.node.queue(thing as Node);
        case 'sourceFile':
          return registries.sourceFile.queue(thing as SourceFile);
        default:
          throw new UnreachableError(refType);
      }
    },
    drain<S, T, N, D, SF>(sink: Partial<QueueSink<S, N, T, D, SF>>): DrainOutput<S, N, T, D, SF> {
      const out: DrainOutput<S, N, T, D, SF> = {
        declaration: {},
        symbol: {},
        type: {},
        node: {},
        sourceFile: {},
      };
      /**
       * Flush any un-processed items from the processing queue to the drain output
       */
      function flush(): {
        processed: { [KK in keyof EntityMap]: number };
      } {
        const outputInfo = {
          processed: {
            declaration: 0,
            type: 0,
            sourceFile: 0,
            symbol: 0,
            node: 0,
          },
        };
        const { handleDeclaration, handleNode, handleSourceFile, handleType, handleSymbol } = sink;
        if (handleSourceFile) {
          outputInfo.processed.sourceFile += registries.sourceFile.drain(
            // eslint-disable-next-line no-return-assign
            (ref, item) => (out.sourceFile[refId(ref)] = handleSourceFile(ref, item)),
          ).processedCount;
        }
        if (handleDeclaration) {
          outputInfo.processed.declaration += registries.declaration.drain(
            // eslint-disable-next-line no-return-assign
            (ref, item) => (out.declaration[refId(ref)] = handleDeclaration(ref, item)),
          ).processedCount;
        }
        if (handleSymbol) {
          outputInfo.processed.symbol += registries.symbol.drain(
            // eslint-disable-next-line no-return-assign
            (ref, item) => (out.symbol[refId(ref)] = handleSymbol(ref, item)),
          ).processedCount;
        }
        if (handleNode) {
          outputInfo.processed.node += registries.node.drain(
            // eslint-disable-next-line no-return-assign
            (ref, item) => (out.node[refId(ref)] = handleNode(ref, item)),
          ).processedCount;
        }
        if (handleType) {
          outputInfo.processed.type += registries.type.drain(
            // eslint-disable-next-line no-return-assign
            (ref, item) => (out.type[refId(ref)] = handleType(ref, item)),
          ).processedCount;
        }

        return outputInfo;
      }
      const maxPasses = 60;
      let flushCount = 1;
      let lastResult: { processed: { [KK in keyof EntityMap]: number } };
      let nonZeroCategories: string[];
      log(`Beginning processing queue drain (max passes: ${maxPasses})`);
      do {
        lastResult = flush();
        nonZeroCategories = Object.keys(lastResult.processed).reduce(
          // eslint-disable-next-line no-loop-func
          (list, k) => ((lastResult.processed as any)[k] > 0 ? list.concat(k) : list),
          [] as string[],
        );
        const reportMessage = Object.keys(lastResult.processed)
          .sort()
          // eslint-disable-next-line no-loop-func
          .map(k => {
            const amt = (lastResult.processed as any)[k];
            return amt > 0 ? `${amt} ${k}s` : null;
          })
          .filter(Boolean)
          .join(', ');
        log(`Pass ${flushCount} summary: ${reportMessage || "nothing. Looks like we're done"}`);
        flushCount++;
      } while (nonZeroCategories.length > 0 && flushCount < maxPasses);

      return out;
    },
  };
}
