/* eslint-disable no-return-assign */

import {
  SerializedDeclaration,
  SerializedNode,
  SerializedSourceFile,
  SerializedSymbol,
  SerializedType,
} from '@code-to-json/core';
import { createQueue, RefFor, refId, UnreachableError } from '@code-to-json/utils';
import * as debug from 'debug';
import {
  FormattedDeclarationRef,
  FormattedNodeRef,
  FormattedSourceFileRef,
  FormattedSymbolRef,
  FormattedTypeRef,
  FormatterRefRegistry,
} from './types';

const log = debug('code-to-json:formatter:data-collector');

export interface QueueSink<S, T, D, N, SF> {
  handleType(ref: FormattedTypeRef, item: SerializedType): T;
  handleSymbol(ref: FormattedSymbolRef, item: SerializedSymbol): S;
  handleSourceFile(ref: FormattedSourceFileRef, item: SerializedSourceFile): SF;
  handleDeclaration(ref: FormattedDeclarationRef, item: SerializedDeclaration): D;
  handleNode(ref: FormattedNodeRef, item: SerializedNode): N;
}

export interface DrainOutput<S, T, D, N, SF> {
  symbols: { [k: string]: S };
  types: { [k: string]: T };
  sourceFiles: { [k: string]: SF };
  declarations: { [k: string]: D };
  nodes: { [k: string]: N };
}

interface DataCollectorInputs {
  t: SerializedType;
  s: SerializedSymbol;
  f: SerializedSourceFile;
  d: SerializedDeclaration;
  n: SerializedNode;
}

export interface DataCollector {
  queue<
    K extends keyof DataCollectorInputs & keyof FormatterRefRegistry,
    E extends DataCollectorInputs[K]
  >(
    thing: E,
    refType: K,
  ): RefFor<FormatterRefRegistry, K> | undefined;
  drain<S, T, D, N, SF>(sink: Partial<QueueSink<S, T, D, N, SF>>): DrainOutput<S, T, D, N, SF>;
}

export function create(): DataCollector {
  const registries = {
    symbols: createQueue<FormatterRefRegistry, 's', SerializedSymbol, string, undefined>(
      's',
      (s) => s.id,
      (id) => ({ id }),
    ),
    types: createQueue<FormatterRefRegistry, 't', SerializedType, string, undefined>(
      't',
      (t) => t.id,
      (id) => ({ id }),
    ),
    files: createQueue<FormatterRefRegistry, 'f', SerializedSourceFile, string, undefined>(
      'f',
      (f) => f.id,
      (id) => ({ id }),
    ),
    declarations: createQueue<FormatterRefRegistry, 'd', SerializedDeclaration, string, undefined>(
      'd',
      (d) => d.id,
      (id) => ({ id }),
    ),
    nodes: createQueue<FormatterRefRegistry, 'n', SerializedNode, string, undefined>(
      'n',
      (n) => n.id,
      (id) => ({ id }),
    ),
  };

  return {
    queue<K extends keyof DataCollectorInputs & keyof FormatterRefRegistry>(
      thing: DataCollectorInputs[K],
      typ: K,
    ): RefFor<FormatterRefRegistry, K> | undefined {
      const refType: keyof DataCollectorInputs = typ;
      switch (refType) {
        case 's':
          return registries.symbols.queue(thing as SerializedSymbol);
        case 't':
          return registries.types.queue(thing as SerializedType);
        case 'f':
          return registries.files.queue(thing as SerializedSourceFile);
        case 'd':
          return registries.declarations.queue(thing as SerializedDeclaration);
        case 'n':
          return registries.nodes.queue(thing as SerializedNode);
        default:
          throw new UnreachableError(refType);
      }
    },
    drain<S, T, D, N, SF>(sink: Partial<QueueSink<S, T, D, N, SF>>): DrainOutput<S, T, D, N, SF> {
      const out: DrainOutput<S, T, D, N, SF> = {
        symbols: {},
        types: {},
        sourceFiles: {},
        declarations: {},
        nodes: {},
      };
      /**
       * Flush any un-processed items from the processing queue to the drain output
       */
      function flush(): {
        processed: { [KK in keyof DataCollectorInputs]: number };
      } {
        const outputInfo = {
          processed: {
            t: 0,
            f: 0,
            s: 0,
            d: 0,
            n: 0,
          },
        };
        const { handleSourceFile, handleType, handleSymbol, handleDeclaration, handleNode } = sink;
        if (handleSourceFile) {
          outputInfo.processed.f += registries.files.drain(
            (ref, item) => (out.sourceFiles[refId(ref)] = handleSourceFile(ref, item)),
          ).processedCount;
        }
        if (handleSymbol) {
          outputInfo.processed.s += registries.symbols.drain(
            (ref, item) => (out.symbols[refId(ref)] = handleSymbol(ref, item)),
          ).processedCount;
        }
        if (handleType) {
          outputInfo.processed.t += registries.types.drain(
            (ref, item) => (out.types[refId(ref)] = handleType(ref, item)),
          ).processedCount;
        }
        if (handleDeclaration) {
          outputInfo.processed.t += registries.declarations.drain(
            (ref, item) => (out.declarations[refId(ref)] = handleDeclaration(ref, item)),
          ).processedCount;
        }
        if (handleNode) {
          outputInfo.processed.t += registries.nodes.drain(
            (ref, item) => (out.nodes[refId(ref)] = handleNode(ref, item)),
          ).processedCount;
        }

        return outputInfo;
      }
      const maxPasses = 60;
      let flushCount = 1;
      let lastResult: { processed: { [KK in keyof DataCollectorInputs]: number } };
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
          .map((k) => {
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
