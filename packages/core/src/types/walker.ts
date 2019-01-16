import { ModulePathNormalizer, SysHost } from '@code-to-json/utils-ts';
import { Queue } from '../processing-queue';
import { WalkerOptions } from '../walker/options';
import {
  SerializedDeclaration,
  SerializedNode,
  SerializedSourceFile,
  SerializedSymbol,
  SerializedType,
} from './serialized-entities';

export interface WalkerOutputData {
  symbols: { [k: string]: Readonly<SerializedSymbol> };
  types: { [k: string]: Readonly<SerializedType> };
  nodes: { [k: string]: Readonly<SerializedNode> };
  declarations: { [k: string]: Readonly<SerializedDeclaration> };
  sourceFiles: { [k: string]: Readonly<SerializedSourceFile> };
}

export interface WalkerOutputMetadata {
  versions: {
    core: string;
  };
  format: 'raw';
}

export interface WalkerOutput {
  codeToJson: WalkerOutputMetadata;
  data: WalkerOutputData;
}

/**
 * A type used to collect and process information as the
 * typescript symbols are walked
 *
 * @internal
 */
export interface Collector {
  // queue of entities to process
  queue: Queue;
  // abstraction of a filesystem (similar to ts.sys)
  host: SysHost;
  // options passed to the walker
  opts: WalkerOptions;
  // the reverse of require.resolve
  pathNormalizer: ModulePathNormalizer;
}
