import {
  Declaration,
  Node,
  SourceFile,
  Symbol as Sym,
  Type,
  TypeChecker,
  TypeFormatFlags
} from 'typescript';
import { EntityMap } from '../types';
import { generateId } from './generate-id';
import {
  DeclarationRef,
  NodeRef,
  RefFor,
  SourceFileRef,
  SymbolRef,
  TypeRef
} from './ref';

export interface QueueSink<S, T, N, D, SF> {
  handleNode(ref: NodeRef, item: Node): N;
  handleType(ref: TypeRef, item: Type): T;
  handleDeclaration(ref: DeclarationRef, item: Declaration): D;
  handleSymbol(ref: SymbolRef, item: Sym): S;
  handleSourceFile(ref: SourceFileRef, item: SourceFile): SF;
}

export interface DrainOutput<S, T, N, D, SF> {
  symbol: S[];
  type: T[];
  node: N[];
  declaration: D[];
  sourceFile: SF[];
}

export interface ProcessingQueue {
  queue<K extends keyof EntityMap>(
    thing: EntityMap[K],
    refType: K,
    checker: TypeChecker
  ): RefFor<K> | undefined;
  drain<S, T, N, D, SF>(
    sink: QueueSink<S, N, T, D, SF>
  ): DrainOutput<S, N, T, D, SF>;
}

interface RefTracking<K extends keyof EntityMap> {
  ref: RefFor<K>;
  processed: boolean;
}

interface ProcessingData {
  symbol: Map<Sym, RefTracking<'symbol'>>;
  type: Map<Type, RefTracking<'type'>>;
  declaration: Map<Declaration, RefTracking<'declaration'>>;
  node: Map<Node, RefTracking<'node'>>;
  sourceFile: Map<SourceFile, RefTracking<'sourceFile'>>;
}

interface SinkFn<S, T, N, D, SF> {
  symbol: QueueSink<S, T, N, D, SF>['handleSymbol'];
  type: QueueSink<S, T, N, D, SF>['handleType'];
  declaration: QueueSink<S, T, N, D, SF>['handleDeclaration'];
  node: QueueSink<S, T, N, D, SF>['handleNode'];
  sourceFile: QueueSink<S, T, N, D, SF>['handleSourceFile'];
}

/**
 * Obtain the appropriate function from a `QueueSink` to handle a particular
 * reference type
 *
 * @param refType reference type
 * @param sink QueueSink
 */
function mapperForReferenceType<K extends keyof EntityMap, S, T, N, D, SF>(
  refType: K,
  sink: Partial<QueueSink<S, T, N, D, SF>>
): SinkFn<S, T, N, D, SF>[K] | undefined {
  if (refType === 'symbol') {
    return sink.handleSymbol;
  } else if (refType === 'type') {
    return sink.handleType;
  } else if (refType === 'sourceFile') {
    return sink.handleSourceFile;
  } else if (refType === 'declaration') {
    return sink.handleDeclaration;
  } else if (refType === 'node') {
    return sink.handleNode;
  } else {
    // Should never reach here
    throw new Error('Unexpected reference type: ' + refType);
  }
}

/**
 * Create a new processing queue
 */
export function create(): ProcessingQueue {
  const data: ProcessingData = {
    symbol: new Map<Sym, RefTracking<'symbol'>>(),
    type: new Map<Type, RefTracking<'type'>>(),
    node: new Map<Node, RefTracking<'node'>>(),
    declaration: new Map<Declaration, RefTracking<'declaration'>>(),
    sourceFile: new Map<SourceFile, RefTracking<'sourceFile'>>()
  };

  return {
    queue<K extends keyof EntityMap>(
      thing: EntityMap[K],
      refType: K,
      checker: TypeChecker
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
          thing as Type,
          undefined,
          // tslint:disable-next-line:no-bitwise
          TypeFormatFlags.NoTruncation &
            TypeFormatFlags.UseAliasDefinedOutsideCurrentScope &
            TypeFormatFlags.AddUndefined
        );
      }
      map.set(thing, { ref, processed: false });
      return ref;
    },
    drain<S, T, N, D, SF>(
      sink: Partial<QueueSink<S, N, T, D, SF>>
    ): DrainOutput<S, N, T, D, SF> {
      const out: DrainOutput<S, N, T, D, SF> = {
        declaration: [],
        symbol: [],
        type: [],
        node: [],
        sourceFile: []
      };
      /**
       * Flush any un-processed items from the processing queue to the drain output
       */
      function flush<K extends keyof EntityMap>(): { processed: number } {
        const outputInfo = {
          processed: 0
        };

        (['declaration', 'symbol', 'type', 'node', 'sourceFile'] as Array<
          keyof EntityMap
        >).forEach((key) => {
          const map = data[key] as Map<EntityMap[K], RefTracking<K>>;
          const outArray: Array<S | N | T | D | SF> = out[key];
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
      const maxLoops = 60;
      let flushCount = 1;
      let lastResult = flush();
      while (lastResult.processed > 0 && flushCount < maxLoops) {
        // tslint:disable-next-line:no-console
        console.log(
          `(${flushCount}) Processed: ${lastResult.processed} things`
        );
        lastResult = flush();
        flushCount++;
      }
      // tslint:disable-next-line:no-console
      console.log(
        `(${flushCount} - final) Processed: ${lastResult.processed} things`
      );
      return out;
    }
  };
}
