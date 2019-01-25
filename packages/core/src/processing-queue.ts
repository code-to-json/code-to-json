/* eslint-disable no-return-assign */

import { createQueue, RefFor, refId, UnreachableError } from '@code-to-json/utils';
import { createIdGenerator, isErroredType } from '@code-to-json/utils-ts';
import { GenerateIdResult } from '@code-to-json/utils-ts/lib/src/generate-id';
import * as debug from 'debug';
import * as ts from 'typescript';
import {
  DeclarationRef,
  EntityMap,
  NodeRef,
  RefRegistry,
  SourceFileRef,
  SymbolRef,
  TypeRef,
} from './types/ref';

/**
 * Processors for the queue are what do the work on the queued items.
 * They each receive a reference (serves as a placeholder for the transformed object
 * that the processor will create) and the original object.
 *
 * @internal
 */
export interface QueueProcessors<S, T, N, D, SF> {
  mapNode(ref: NodeRef, item: ts.Node, relatedInfo?: string[]): N;
  mapType(ref: TypeRef, item: ts.Type, relatedInfo?: string[]): T;
  mapDeclaration(ref: DeclarationRef, item: ts.Declaration, relatedInfo?: string[]): D;
  mapSymbol(ref: SymbolRef, item: ts.Symbol, relatedInfo?: string[]): S;
  mapSourceFile(ref: SourceFileRef, item: ts.SourceFile, relatedInfo?: string[]): SF;
}

/**
 * A queue for deferred processing. This is used in situations where
 * the act of doing work could result in additional work being discovered
 *
 * @internal
 */
export interface Queue {
  queue<K extends keyof EntityMap, E extends EntityMap[K]>(
    thing: E | undefined,
    refType: K,
  ): RefFor<RefRegistry, K> | undefined;
  process<S, T, N, D, SF>(
    processors: Partial<QueueProcessors<S, N, T, D, SF>>,
  ): ProcessResult<S, N, T, D, SF>;
}

/**
 * The ultimate result for waves of processing
 *
 * @internal
 */
export interface ProcessResult<S, T, N, D, SF> {
  symbols: { [k: string]: S };
  types: { [k: string]: T };
  nodes: { [k: string]: N };
  declarations: { [k: string]: D };
  sourceFiles: { [k: string]: SF };
}

const log = debug('code-to-json:processor');

/**
 * Create a new processing queue
 * @param checker type-checker
 *
 * @internal
 */
export function create(checker: ts.TypeChecker): Queue {
  const generateId = createIdGenerator(checker);
  const idExtractor = (x: GenerateIdResult) => ({ id: x[1], otherInfo: x[2] });

  /**
   * the state that makes the closure from create() useful
   * queues for each entity type we care about doing work on
   */
  const toProcess = {
    nodes: createQueue<RefRegistry, 'node', ts.Node, GenerateIdResult, string[]>(
      'node',
      generateId,
      idExtractor,
    ),
    symbols: createQueue<RefRegistry, 'symbol', ts.Symbol, GenerateIdResult, string[]>(
      'symbol',
      generateId,
      idExtractor,
    ),
    types: createQueue<RefRegistry, 'type', ts.Type, GenerateIdResult, string[]>(
      'type',
      generateId,
      idExtractor,
    ),
    sourceFiles: createQueue<RefRegistry, 'sourceFile', ts.SourceFile, GenerateIdResult, string[]>(
      'sourceFile',
      generateId,
      idExtractor,
    ),
    declarations: createQueue<
      RefRegistry,
      'declaration',
      ts.Declaration,
      GenerateIdResult,
      string[]
    >('declaration', generateId, idExtractor),
  };

  return {
    queue<K extends keyof EntityMap>(
      thing: EntityMap[K] | undefined,
      typ: K,
    ): RefFor<RefRegistry, K> | undefined {
      if (!thing) {
        return undefined;
      }
      const refType: keyof EntityMap = typ;
      switch (refType) {
        case 'declaration':
          return toProcess.declarations.queue(thing as ts.Declaration);
        case 'symbol':
          return toProcess.symbols.queue(thing as ts.Symbol);
        case 'type': {
          const typeToQueue = thing as ts.Type;
          if (isErroredType(typeToQueue)) {
            throw new Error('Refusing to queue errored type');
          } else {
            return toProcess.types.queue(typeToQueue);
          }
        }
        case 'node':
          return toProcess.nodes.queue(thing as ts.Node);
        case 'sourceFile':
          return toProcess.sourceFiles.queue(thing as ts.SourceFile);
        default:
          throw new UnreachableError(refType);
      }
    },
    process<S, T, N, D, SF>(
      sink: Partial<QueueProcessors<S, N, T, D, SF>>,
    ): ProcessResult<S, N, T, D, SF> {
      const out: ProcessResult<S, N, T, D, SF> = {
        declarations: {},
        symbols: {},
        types: {},
        nodes: {},
        sourceFiles: {},
      };
      /**
       * Flush any un-processed items from the processing queue to the drain output
       */
      function processWork(): {
        processed: { [KK in keyof EntityMap]: number };
      } {
        // Keep track of the number of each kind of entity that's been processed
        const outputInfo: { processed: { [KK in keyof EntityMap]: number } } = {
          processed: {
            declaration: 0,
            type: 0,
            sourceFile: 0,
            symbol: 0,
            node: 0,
          },
        };
        const {
          mapDeclaration: handleDeclaration,
          mapNode: handleNode,
          mapSourceFile: handleSourceFile,
          mapType: handleType,
          mapSymbol: handleSymbol,
        } = sink;
        /**
         * it would be nice to DRY this up, but doing so currently results in a loss of type-safety.
         */
        if (handleSourceFile) {
          outputInfo.processed.sourceFile += toProcess.sourceFiles.drain(
            (ref, item) => (out.sourceFiles[refId(ref)] = handleSourceFile(ref, item)),
          ).processedCount;
        }
        if (handleDeclaration) {
          outputInfo.processed.declaration += toProcess.declarations.drain(
            (ref, item) => (out.declarations[refId(ref)] = handleDeclaration(ref, item)),
          ).processedCount;
        }
        if (handleSymbol) {
          outputInfo.processed.symbol += toProcess.symbols.drain(
            (ref, item) => (out.symbols[refId(ref)] = handleSymbol(ref, item)),
          ).processedCount;
        }
        if (handleNode) {
          outputInfo.processed.node += toProcess.nodes.drain(
            (ref, item) => (out.nodes[refId(ref)] = handleNode(ref, item)),
          ).processedCount;
        }
        if (handleType) {
          outputInfo.processed.type += toProcess.types.drain(
            (ref, item) => (out.types[refId(ref)] = handleType(ref, item)),
          ).processedCount;
        }

        return outputInfo;
      }
      /**
       * Maximum number of passes allowed, as we attempt to reach the end of the queue
       */
      const maxPasses = 60;

      // --- The following is state that's updated as we attempt to flush the queue --- //

      // keep track of the number of passes we've done so far
      let passCount = 1;

      // the number of items of each kind that we processed in the last wave
      let lastResult: { processed: { [KK in keyof EntityMap]: number } };

      // names of entity types where work was done in the most recent pass
      let lastNonZeroCategories: string[];
      // reducer for determining categories where work was done
      const nonzeroCategoryReducer = (list: string[], k: string) =>
        lastResult.processed[k as keyof EntityMap] > 0 ? list.concat(k) : list;

      log(`beginning processing queue drain (max passes: ${maxPasses})`);

      /**
       * Generate a logging message, reporting how much work was done
       * in each pass of the processing queue
       */
      function generateReportMessage(): string {
        return (
          Object.keys(lastResult.processed)
            .sort()
            // eslint-disable-next-line no-loop-func
            .map(k => {
              const amt = (lastResult.processed as any)[k];
              return amt > 0 ? `${amt} ${k}s` : null;
            })
            .filter(Boolean)
            .join(', ')
        );
      }

      do {
        // process everything that's in the queue at this moment
        lastResult = processWork();

        // discover categories of entities that had something processed
        lastNonZeroCategories = Object.keys(lastResult.processed).reduce(
          nonzeroCategoryReducer,
          [] as string[],
        );

        // log the work that was done
        const reportMessage = generateReportMessage();
        log(`Pass ${passCount} summary: ${reportMessage || "nothing. Looks like we're done"}`);

        // tally this pass
        passCount++;
        // keep going until we either exceed our budget of passes, or the queues are empty
      } while (lastNonZeroCategories.length > 0 && passCount < maxPasses);

      // return the result (all of the processed work)
      return out;
    },
  };
}
