import { SysHost } from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';
import { Queue } from '../processing-queue';
import WalkerConfig from '../walker/config';

import {
  SerializedDeclaration,
  SerializedNode,
  SerializedSourceFile,
  SerializedSymbol,
  SerializedType,
} from './serialized-entities';

export interface WalkerOutputData {
  symbols: Dict<Readonly<SerializedSymbol>>;
  types: Dict<Readonly<SerializedType>>;
  nodes: Dict<Readonly<SerializedNode>>;
  declarations: Dict<Readonly<SerializedDeclaration>>;
  sourceFiles: Dict<Readonly<SerializedSourceFile>>;
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
  cfg: WalkerConfig;
}
