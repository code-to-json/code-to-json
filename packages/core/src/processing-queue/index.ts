import * as ts from 'typescript';
// import { SerializedDeclaration } from '../serializers/declaration';
// import { SerializedNode } from '../serializers/node';
// import { SerializedSymbol } from '../serializers/symbol';
// import { SerializedType } from '../serializers/type';
import { EntityMap } from '../types';
import { generateId } from './generate-id';
import { DeclarationRef, NodeRef, RefFor, SymbolRef, TypeRef } from './ref';

export interface QueueSink<S, T, N, D> {
  handleNode(ref: NodeRef, item: ts.Node): N;
  handleType(ref: TypeRef, item: ts.Type): T;
  handleDeclaration(ref: DeclarationRef, item: ts.Declaration): D;
  handleSymbol(ref: SymbolRef, item: ts.Symbol): S;
}

export interface DrainOutput<S, T, N, D> {
  symbol: S[];
  type: T[];
  node: N[];
  declaration: D[];
}

export interface ProcessingQueue {
  queue<K extends keyof EntityMap>(
    thing: EntityMap[K],
    refType: K,
    checker: ts.TypeChecker
  ): RefFor<K> | undefined;
  drain<S, T, N, D>(sink: QueueSink<S, N, T, D>): DrainOutput<S, N, T, D>;
}

interface RefTracking<K extends keyof EntityMap> {
  ref: RefFor<K>;
  processed: boolean;
}

// interface SerializedEntityMap {
//   symbol: SerializedSymbol;
//   type: SerializedType;
//   node: SerializedNode;
//   declaration: SerializedDeclaration;
// }

interface ProcessingData {
  symbol: Map<ts.Symbol, RefTracking<'symbol'>>;
  type: Map<ts.Type, RefTracking<'type'>>;
  declaration: Map<ts.Declaration, RefTracking<'declaration'>>;
  node: Map<ts.Node, RefTracking<'node'>>;
}

interface SinkFn<S, T, N, D> {
  symbol: QueueSink<S, T, N, D>['handleSymbol'];
  type: QueueSink<S, T, N, D>['handleType'];
  declaration: QueueSink<S, T, N, D>['handleDeclaration'];
  node: QueueSink<S, T, N, D>['handleNode'];
}

// tslint:disable-next-line:max-line-length
function mapperForReferenceType<K extends keyof EntityMap, S, T, N, D>(
  refType: K,
  sink: Partial<QueueSink<S, T, N, D>>
): SinkFn<S, T, N, D>[K] | undefined {
  if (refType === 'symbol') {
    return sink.handleSymbol;
  } else if (refType === 'type') {
    return sink.handleType;
  } else if (refType === 'declaration') {
    return sink.handleDeclaration;
  } else if (refType === 'node') {
    return sink.handleNode;
  } else {
    // Should never reach here
    throw new Error('Unexpected reference type: ' + refType);
  }
}

export function create(): ProcessingQueue {
  const data: ProcessingData = {
    symbol: new Map<ts.Symbol, RefTracking<'symbol'>>(),
    type: new Map<ts.Type, RefTracking<'type'>>(),
    node: new Map<ts.Node, RefTracking<'node'>>(),
    declaration: new Map<ts.Declaration, RefTracking<'declaration'>>()
  };

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
    drain<S, T, N, D>(
      sink: Partial<QueueSink<S, N, T, D>>
    ): DrainOutput<S, N, T, D> {
      const out: DrainOutput<S, N, T, D> = {
        declaration: [],
        symbol: [],
        type: [],
        node: []
      };
      function flush<K extends keyof EntityMap>(): { processed: number } {
        const outputInfo = {
          processed: 0
        };

        (['declaration', 'symbol', 'type', 'node'] as Array<
          keyof EntityMap
        >).forEach((key) => {
          const map = data[key] as Map<EntityMap[K], RefTracking<K>>;
          const outArray: Array<S | N | T | D> = out[key];
          map.forEach((rt, item) => {
            if (rt.processed === true) {
              return;
            }
            const fn = mapperForReferenceType(rt.ref.refType, sink) as ((
              ref: RefFor<K>,
              item: EntityMap[K]
            ) => S | N | D | T);
            outArray.push(fn(rt.ref as RefFor<K>, item));
            rt.processed = true;
            outputInfo.processed++;
          });
        });
        return outputInfo;
      }
      const maxLoops = 10;
      const flushCount = 0;
      let lastResult = flush();
      while (lastResult.processed > 0 && flushCount < maxLoops) {
        // tslint:disable-next-line:no-console
        console.log(`Processed: ${lastResult.processed} things`);
        lastResult = flush();
      }
      // tslint:disable-next-line:no-console
      console.log(`Processed: ${lastResult.processed} things`);
      return out;
    }
  };
}
