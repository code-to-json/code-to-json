import { SysHost } from '@code-to-json/utils-ts';
import { Program } from 'typescript';
import { create as createQueue } from '../processing-queue';
import serializeDeclaration from '../serializers/declaration';
import serializeNode from '../serializers/node';
import serializeSourceFile from '../serializers/source-file';
import serializeSymbol from '../serializers/symbol';
import serializeType from '../serializers/type';
import { Collector, WalkerOutput } from '../types/walker';
import WalkerConfig from './config';
import { WalkerOptions } from './options';

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
    mapNode: (ref, item) => serializeNode(item, checker, ref, collector),
    mapType: (ref, item) => serializeType(item, checker, ref, collector),
    mapSourceFile: (ref, item) => serializeSourceFile(item, checker, ref, collector),
    mapSymbol: (ref, item) => serializeSymbol(item, checker, ref, collector),
    mapDeclaration: (ref, item) => serializeDeclaration(item, checker, ref, collector),
  });

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
