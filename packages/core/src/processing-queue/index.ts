import * as ts from 'typescript';
import { EntityMap } from '../types';
import { generateId } from './generate-id';
import Ref from './ref';

export interface ProcessingQueue {
  queue<K extends keyof EntityMap>(
    thing: EntityMap[K],
    refType: K
  ): Ref<K> | undefined;
  drain<K extends keyof EntityMap>(
    cb: (ref: Ref<K>, entity: EntityMap[K]) => any
  ): { [KK in keyof EntityMap]: any[] };
}

interface RefTracking<K extends keyof EntityMap> {
  ref: Ref<K>;
  processed: boolean;
}

export function create(): ProcessingQueue {
  const data: { [K in keyof EntityMap]: Map<EntityMap[K], RefTracking<K>> } = {
    symbol: new Map<ts.Symbol, RefTracking<'symbol'>>(),
    type: new Map<ts.Type, RefTracking<'type'>>(),
    declaration: new Map<ts.Declaration, RefTracking<'declaration'>>()
  };

  const out = {
    declaration: [] as any[],
    symbol: [] as any[],
    type: [] as any[]
  };
  function flush<K extends keyof EntityMap>(
    cb: (ref: Ref<K>, entity: EntityMap[K]) => any
  ): { processed: number } {
    const outputInfo = {
      processed: 0
    };
    (['declaration', 'symbol', 'type'] as Array<keyof EntityMap>).forEach(
      (key) => {
        const map = data[key] as Map<EntityMap[K], RefTracking<K>>;
        map.forEach((rt, item) => {
          if (rt.processed === true) {
            return;
          }
          out[key].push(cb(rt.ref as Ref<K>, item));
          rt.processed = true;
          outputInfo.processed++;
        });
      }
    );
    return outputInfo;
  }
  return {
    queue<K extends keyof EntityMap>(
      thing: EntityMap[K],
      refType: K
    ): Ref<K> | undefined {
      if (!thing) {
        return;
      }
      const map = data[refType] as Map<EntityMap[K], RefTracking<K>>;
      const rt = map.get(thing);
      if (rt) {
        return rt.ref;
      }
      const id = generateId(thing);
      const ref = { refType, id } as Ref<K>;

      map.set(thing, { ref, processed: false });
      return ref;
    },
    drain<K extends keyof EntityMap>(
      cb: (ref: Ref<K>, entity: EntityMap[K]) => any
    ): { [KK in keyof EntityMap]: any[] } {
      const maxLoops = 10;
      const flushCount = 0;
      let lastResult = flush(cb);
      while (lastResult.processed > 0 && flushCount < maxLoops) {
        // tslint:disable-next-line:no-console
        console.log(`Processed: ${lastResult.processed} things`);
        lastResult = flush(cb);
      }
      // tslint:disable-next-line:no-console
      console.log(`Processed: ${lastResult.processed} things`);
      return out;
    }
  };
}
