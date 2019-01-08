import { ModulePathNormalizer, SysHost } from '@code-to-json/utils-ts';
import { ProcessingQueue } from './processing-queue';
import { WalkerOptions } from './walker/options';

export default interface Collector {
  queue: ProcessingQueue;
  host: SysHost;
  opts: WalkerOptions;
  pathNormalizer: ModulePathNormalizer;
}
