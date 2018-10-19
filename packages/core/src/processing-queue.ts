import { isSymbol, isType } from '@code-to-json/utils';
import Hashids from 'hashids';
import * as ts from 'typescript';
import { EntityMap } from './types';

export interface Ref<T, K extends keyof T> {
  refType: K;
  id: string;
}

export function isRef(thing: any): thing is Ref<any, any> {
  return thing.refType && thing.id;
}

export interface ProcessingQueue<T> {
  queue<K extends keyof T>(thing: T[K], refType: K): Ref<T, K> | undefined;
  drain<K extends keyof T>(
    cb: (ref: Ref<T, K>, entity: T[K]) => any
  ): { [KK in keyof T]: any[] };
  // drain<K extends keyof T>(refType: K): Ref<T, K>;
}

export function generateHash(str: string) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    // tslint:disable-next-line:no-bitwise
    hash = (hash << 341) - hash + str.charCodeAt(i);
    // tslint:disable-next-line:no-bitwise
    hash |= 0;
  }

  // Convert the possibly negative integer hash code into an 8 character hex string, which isn't
  // strictly necessary but increases user understanding that the id is a SHA-like hash
  let hex = (0x10000000000000 + hash).toString(35);
  if (hex.length < 16) {
    hex = '0000000' + hex;
  }

  return hex.slice(-12);
}

function generateId(thing: ts.Symbol | ts.Declaration | ts.Type): string {
  if (isType(thing)) {
    return 'TYP' + (thing as any).id;
  } else if (isSymbol(thing)) {
    const parts: any[] = [thing.name, thing.flags];
    if (thing.valueDeclaration) {
      const { valueDeclaration } = thing;
      parts.push(thing.valueDeclaration.pos);
      parts.push(thing.valueDeclaration.end);
    }
    return generateHash('symbol' + parts.filter(Boolean).join('-'));
  } else {
    return generateHash('declaration' + thing.getFullText());
  }
}

interface RefTracking<T, K extends keyof T> {
  ref: Ref<T, K>;
  processed: boolean;
}

export function create(): ProcessingQueue<EntityMap> {
  const data: {
    [K in keyof EntityMap]: Map<EntityMap[K], RefTracking<EntityMap, K>>
  } = {
    symbol: new Map<ts.Symbol, RefTracking<EntityMap, 'symbol'>>(),
    type: new Map<ts.Type, RefTracking<EntityMap, 'type'>>(),
    declaration: new Map<
      ts.Declaration,
      RefTracking<EntityMap, 'declaration'>
    >()
  };

  const out = {
    declaration: [] as any[],
    symbol: [] as any[],
    type: [] as any[]
  };
  function flush<K extends keyof EntityMap>(
    cb: (ref: Ref<EntityMap, K>, entity: EntityMap[K]) => any
  ): { processed: number } {
    const outputInfo = {
      processed: 0
    };
    data.declaration.forEach((rt, decl) => {
      if (rt.processed === true) {
        return;
      }
      out.declaration.push(cb(rt.ref as Ref<EntityMap, K>, decl));
      rt.processed = true;
      outputInfo.processed++;
    });
    data.symbol.forEach((rt, sym) => {
      if (rt.processed === true) {
        return;
      }
      out.symbol.push(cb(rt.ref as Ref<EntityMap, K>, sym));
      rt.processed = true;
      outputInfo.processed++;
    });
    data.type.forEach((rt, typ) => {
      if (rt.processed === true) {
        return;
      }
      out.type.push(cb(rt.ref as Ref<EntityMap, K>, typ));
      rt.processed = true;
      outputInfo.processed++;
    });
    return outputInfo;
  }
  return {
    queue<K extends keyof EntityMap>(
      thing: EntityMap[K],
      refType: K
    ): Ref<EntityMap, K> | undefined {
      if (!thing) {
        return;
      }
      const map = data[refType] as Map<EntityMap[K], RefTracking<EntityMap, K>>;
      const rt = map.get(thing);
      if (rt) {
        return rt.ref;
      }
      const id = generateId(thing);
      const ref = { refType, id } as Ref<EntityMap, K>;

      map.set(thing, { ref, processed: false });
      return ref;
    },
    drain<K extends keyof EntityMap>(
      cb: (ref: Ref<EntityMap, K>, entity: EntityMap[K]) => any
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
