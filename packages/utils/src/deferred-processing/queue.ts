import { createRef, Ref, RefTypes } from './ref';

/**
 * @internal
 */
interface EntityInfo<K, O> {
  /** reference */
  ref: Ref<K>;
  /** additional information */
  otherInfo?: O;
  /** whether this entity has been processed or not */
  processed: boolean;
}

/**
 * A work queue
 * @private
 */
export interface Queue<K, T extends object, OtherInfo> {
  queue(item: T): Ref<K>;
  numUnprocessed(): number;
  drain(cb: (ref: Ref<K>, item: T, ohterInfo?: OtherInfo) => void): { processedCount: number };
  drainUntilEmpty(cb: (ref: Ref<K>, item: T) => void): { processedCount: number };
}

/**
 * Create a new work queue for a type of entity
 *
 * @param k the name of the entity type
 * @param getIdInfo function used to generate id-data from an object
 * @param extractId function used to extract an id from id-data
 * @private
 */
export function createQueue<
  RefRegistry,
  K extends RefTypes<RefRegistry>,
  T extends object,
  IDInfo = string,
  OtherInfo = undefined
>(
  k: K,
  getIdInfo: (t: T) => IDInfo,
  extractId: (info: IDInfo) => { id: string; otherInfo?: OtherInfo } = (id) => ({ id: id as any }),
): Queue<K, T, OtherInfo> {
  const itemToRef = new Map<T, EntityInfo<K, OtherInfo>>();
  return {
    queue(item: T): Ref<K> {
      const existingInfo = itemToRef.get(item);
      if (existingInfo) {
        return existingInfo.ref;
      }
      const idInfo = getIdInfo(item);
      const { id, otherInfo } = extractId(idInfo);
      const ref: Ref<K> = createRef<RefRegistry, K>(k, id);
      itemToRef.set(item, { ref, otherInfo, processed: false });
      return ref;
    },
    numUnprocessed(): number {
      return [...itemToRef.values()].reduce((ct, info) => (info.processed ? ct : ct + 1), 0);
    },
    drain<V = void>(
      cb: (ref: Ref<K>, item: T, otherInfo?: OtherInfo) => V,
    ): { processedCount: number } {
      let processedCount = 0;
      itemToRef.forEach((value, key) => {
        const { ref, processed, otherInfo } = value;
        if (processed) {
          return;
        }
        cb(ref, key, otherInfo);
        // eslint-disable-next-line no-param-reassign
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
    },
  };
}
