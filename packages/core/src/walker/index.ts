import { createRef, refId } from '@code-to-json/utils';
import { SysHost } from '@code-to-json/utils-ts';
import { Program } from 'typescript';
import { create as createQueue } from '../processing-queue';
import serializeDeclaration from '../serializers/declaration';
import serializeNode from '../serializers/node';
import serializeSourceFile from '../serializers/source-file';
import serializeSymbol from '../serializers/symbol';
import serializeType from '../serializers/type';
import { RefRegistry } from '../types/ref';
import { SerializedSymbol, SerializedType } from '../types/serialized-entities';
import { Collector, WalkerOutput, WalkerOutputData } from '../types/walker';
import WalkerConfig from './config';
import { WalkerOptions } from './options';

function postProcessSymbol({ symbols }: WalkerOutputData, sym: SerializedSymbol): void {
  if (sym.relatedSymbols) {
    sym.relatedSymbols.forEach(relatedRef => {
      const related: SerializedSymbol | undefined = symbols[refId(relatedRef)];
      if (related) {
        const selfRef = createRef<RefRegistry, 'symbol'>('symbol', sym.id);
        if (!related.relatedSymbols) {
          related.relatedSymbols = [selfRef];
        } else {
          const tracked = related.relatedSymbols.map(ref => refId(ref)).includes(sym.id);
          if (!tracked) {
            related.relatedSymbols.push();
          }
        }
      }
    });
  }
}

function postProcessType({ types }: WalkerOutputData, type: SerializedType): void {
  if (type.relatedTypes) {
    type.relatedTypes.forEach(relatedRef => {
      const related: SerializedType | undefined = types[refId(relatedRef)];
      if (related) {
        const selfRef = createRef<RefRegistry, 'type'>('type', type.id);
        if (!related.relatedTypes) {
          related.relatedTypes = [selfRef];
        } else {
          const tracked = related.relatedTypes.map(ref => refId(ref)).includes(type.id);
          if (!tracked) {
            related.relatedTypes.push();
          }
        }
      }
    });
  }
}

function postprocessData(wod: WalkerOutputData): void {
  const { symbols, types } = wod;
  Object.keys(symbols).forEach(s => {
    const sym = symbols[s];
    if (sym) {
      postProcessSymbol(wod, sym);
    }
  });
  Object.keys(types).forEach(s => {
    const typ = types[s];
    if (typ) {
      postProcessType(wod, typ);
    }
  });
}

/**
 * Walk a typescript program, using specified entry points, returning JSON information describing the code
 *
 * @param program typescript program to analyze
 * @param host abstraction of the host this program is running on
 * @param options
 */
export function walkProgram(
  program: Program,
  host: SysHost,
  options: Partial<WalkerOptions> = {},
): WalkerOutput {
  const cfg = new WalkerConfig(options);

  // Create the type-checker
  const checker = program.getTypeChecker();

  // Get all non-declaration source files
  const sourceFiles = program.getSourceFiles().filter(sf => cfg.shouldIncludeSourceFile(sf));

  // Initialize the work-processing queue
  const queue = createQueue(checker);
  sourceFiles.forEach(sf => queue.queue(sf, 'sourceFile'));
  const collector: Collector = {
    queue,
    host,
    cfg,
  };

  /**
   * set up the processors for the queue, and iteratively drain until
   * we reach the iteration limit or no more work remains
   */
  const data = queue.process({
    mapNode: (ref, item, related) => serializeNode(item, checker, ref, related, collector),
    mapType: (ref, item, related) => serializeType(item, checker, ref, related, collector),
    mapSourceFile: (ref, item, related) =>
      serializeSourceFile(item, checker, ref, related, collector),
    mapSymbol: (ref, item, related) => serializeSymbol(item, checker, ref, related, collector),
    mapDeclaration: (ref, item, related) =>
      serializeDeclaration(item, checker, ref, related, collector),
  });

  postprocessData(data);

  return {
    codeToJson: {
      versions: {
        core: 'pkg.version',
      },
      format: 'raw',
    },
    data,
  };
}
