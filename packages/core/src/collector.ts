import { ModulePathNormalizer, SysHost } from '@code-to-json/utils-ts';
import { ProcessingQueue } from './processing-queue';
import { WalkerOptions } from './walker/options';

/**
 * A type used to collect and process information as the
 * typescript symbols are walked
 */
export default interface Collector {
  // queue of entities to process
  queue: ProcessingQueue;
  // abstraction of a filesystem (similar to ts.sys)
  host: SysHost;
  // options passed to the walker
  opts: WalkerOptions;
  // the reverse of require.resolve
  pathNormalizer: ModulePathNormalizer;
}
