import * as ts from 'typescript';
import { SerializedDeclaration } from '../serializers/declaration';
import { SerializedNode } from '../serializers/node';
import { SerializedSymbol } from '../serializers/symbol';
import { SerializedType } from '../serializers/type';
import { EntityMap } from '../types';
import { generateId } from './generate-id';
import { RefFor, TypeRef } from './ref';

export interface ProcessingQueue {
  queue<K extends keyof EntityMap>(
    thing: EntityMap[K],
    refType: K,
    checker: ts.TypeChecker
  ): RefFor<K> | undefined;
  drain<K extends keyof EntityMap>(
    cb: (ref: RefFor<K>, entity: EntityMap[K]) => any
  ): { [KK in keyof EntityMap]: any[] };
}

interface RefTracking<K extends keyof EntityMap> {
  ref: RefFor<K>;
  processed: boolean;
}

interface SerializedEntityMap {
  symbol: SerializedSymbol;
  type: SerializedType;
  node: SerializedNode;
  declaration: SerializedDeclaration;
}

export function create(): ProcessingQueue {
  const data: { [K in keyof EntityMap]: Map<EntityMap[K], RefTracking<K>> } = {
    symbol: new Map<ts.Symbol, RefTracking<'symbol'>>(),
    type: new Map<ts.Type, RefTracking<'type'>>(),
    node: new Map<ts.Node, RefTracking<'node'>>(),
    declaration: new Map<ts.Declaration, RefTracking<'declaration'>>()
  };

  const out = {
    declaration: [] as SerializedDeclaration[],
    symbol: [] as SerializedSymbol[],
    type: [] as SerializedType[],
    node: [] as SerializedNode[]
  };
  function flush<K extends keyof EntityMap>(
    cb: (ref: RefFor<K>, entity: EntityMap[K]) => SerializedEntityMap[K]
  ): { processed: number } {
    const outputInfo = {
      processed: 0
    };
    (['declaration', 'symbol', 'type', 'node'] as Array<
      keyof EntityMap
    >).forEach((key) => {
      const map = data[key] as Map<EntityMap[K], RefTracking<K>>;
      const outArray: Array<SerializedEntityMap[K]> = out[key];
      map.forEach((rt, item) => {
        if (rt.processed === true) {
          return;
        }
        outArray.push(cb(rt.ref as RefFor<K>, item) as SerializedEntityMap[K]);
        rt.processed = true;
        outputInfo.processed++;
      });
    });
    return outputInfo;
  }
  return {
    queue<K extends keyof EntityMap>(
      thing: EntityMap[K],
      refType: K,
      checker: ts.TypeChecker
    ): RefFor<K> | undefined {
      if (!thing) {
        return;
      }
      const map = data[refType] as Map<EntityMap[K], RefTracking<K>>;
      const rt = map.get(thing);
      if (rt) {
        return rt.ref;
      }
      const id = generateId(thing);
      const ref = { refType, id } as RefFor<K>;
      if (refType === 'type') {
        (ref as TypeRef).typeString = checker.typeToString(
          thing as ts.Type,
          undefined,
          // tslint:disable-next-line:no-bitwise
          ts.TypeFormatFlags.NoTruncation &
            ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope &
            ts.TypeFormatFlags.AddUndefined
        );
      }
      map.set(thing, { ref, processed: false });
      return ref;
    },
    drain<K extends keyof EntityMap>(
      cb: (ref: RefFor<K>, entity: EntityMap[K]) => any
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
