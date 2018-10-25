import { createRef, Ref, RefTypes } from './ref';

interface EntityInfo<K extends string, T extends object> {
  ref: Ref<K>;
  processed: boolean;
}

export interface IRegistry<K extends string, T extends object> {
  queue(item: T): Ref<K>;
  numUnprocessed(): number;
  drain(cb: (ref: Ref<K>, item: T) => void): { processedCount: number };
  drainUntilEmpty(cb: (ref: Ref<K>, item: T) => void): { processedCount: number };
}

export function createQueue<K extends RefTypes, T extends object>(
  k: K,
  idGenerator: (t: T) => string
): IRegistry<K, T> {
  const itemToRef = new Map<T, EntityInfo<K, T>>();
  return {
    queue(item: T): Ref<K> {
      const existingInfo = itemToRef.get(item);
      if (existingInfo) {
        return existingInfo.ref;
      } else {
        const id = idGenerator(item);
        const ref: Ref<K> = createRef(k, id);
        itemToRef.set(item, { ref, processed: false });
        return ref;
      }
    },
    numUnprocessed(): number {
      return [...itemToRef.values()].reduce((ct, info) => (info.processed ? ct : ct + 1), 0);
    },
    drain<V = void>(cb: (ref: Ref<K>, item: T) => V): { processedCount: number } {
      let processedCount = 0;
      itemToRef.forEach((value, key) => {
        const { ref, processed } = value;
        if (processed) {
          return;
        }
        cb(ref, key);
        value.processed = true;
        processedCount++;
      });
      return { processedCount };
    },
    drainUntilEmpty(cb: (ref: Ref<K>, item: T) => void): { processedCount: number } {
      let processedCount = 0;
      let { processedCount: sweep } = this.drain(cb);
      while (sweep > 0) {
        sweep = this.drain(cb).processedCount;
        processedCount += sweep;
      }
      return { processedCount };
    }
  };
}
