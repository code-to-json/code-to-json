import { isDefined, Ref, refId, refType } from '@code-to-json/utils';
import { mapDict } from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';
import {
  LinkedFormattedOutputMap,
  LinkedFormattedRefResolver,
  MaybeLinkedFormattedOutputData,
} from './types';

const refTypeToCollectionMap = {
  d: 'declaration',
  f: 'sourceFile',
  s: 'symbol',
  t: 'type',
  n: 'node',
};

/**
 * @internal
 * @param dat multi-store
 */
export function createLinkedFormattedRefResolver(
  dat: MaybeLinkedFormattedOutputData,
): LinkedFormattedRefResolver {
  return function resolveReference<K extends keyof LinkedFormattedOutputMap>(
    ref?: Ref<K>,
  ): LinkedFormattedOutputMap[K] | undefined {
    if (!ref) {
      return undefined;
    }
    const rKind = refTypeToCollectionMap[refType(ref)];
    const rId = refId(ref);
    const collection = (dat as any)[`${rKind}s`];
    return collection[rId];
  };
}

export function resolveRefList<RefKind extends keyof LinkedFormattedOutputMap>(
  list: Array<Ref<RefKind>> | undefined,
  res: LinkedFormattedRefResolver,
): Array<LinkedFormattedOutputMap[RefKind]> | undefined {
  if (!list) {
    return undefined;
  }
  return list.map(res).filter(isDefined);
}

export function resolveRefDict<RefKind extends keyof LinkedFormattedOutputMap>(
  dict: Dict<Ref<RefKind>> | undefined,
  res: LinkedFormattedRefResolver,
): Dict<LinkedFormattedOutputMap[RefKind]> | undefined {
  if (!dict) {
    return undefined;
  }
  return mapDict(dict, res);
}
