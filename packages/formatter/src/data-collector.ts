/* eslint-disable no-return-assign */

import { SerializedSourceFile, SerializedSymbol, SerializedType } from '@code-to-json/core';
import { createQueue, RefFor, refId, UnreachableError } from '@code-to-json/utils';
import * as debug from 'debug';
import {
  FormattedSourceFileRef,
  FormattedSymbolRef,
  FormattedTypeRef,
  FormatterRefRegistry,
} from './types';

const log = debug('code-to-json:formatter:data-collector');

export interface QueueSink<S, T, SF> {
  handleType(ref: FormattedTypeRef, item: SerializedType): T;
  handleSymbol(ref: FormattedSymbolRef, item: SerializedSymbol): S;
  handleSourceFile(ref: FormattedSourceFileRef, item: SerializedSourceFile): SF;
}

export interface DrainOutput<S, T, SF> {
  symbols: { [k: string]: S };
  types: { [k: string]: T };
  sourceFiles: { [k: string]: SF };
}

interface DataCollectorInputs {
  t: SerializedType;
  s: SerializedSymbol;
  f: SerializedSourceFile;
}

export interface DataCollector {
  queue<
    K extends keyof DataCollectorInputs & keyof FormatterRefRegistry,
    E extends DataCollectorInputs[K]
  >(
    thing: E,
    refType: K,
  ): RefFor<FormatterRefRegistry, K> | undefined;
  drain<S, T, SF>(sink: Partial<QueueSink<S, T, SF>>): DrainOutput<S, T, SF>;
}

export function create(): DataCollector {
  const registries = {
    symbols: createQueue<FormatterRefRegistry, 's', SerializedSymbol>('s', s => s.id),
    types: createQueue<FormatterRefRegistry, 't', SerializedType>('t', t => t.id),
    files: createQueue<FormatterRefRegistry, 'f', SerializedSourceFile>('f', f => f.id),
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
        default:
          throw new UnreachableError(refType);
      }
    },
    drain<S, T, SF>(sink: Partial<QueueSink<S, T, SF>>): DrainOutput<S, T, SF> {
      const out: DrainOutput<S, T, SF> = {
        symbols: {},
        types: {},
        sourceFiles: {},
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
          },
        };
        const { handleSourceFile, handleType, handleSymbol } = sink;
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
