import { isDefined, Ref, refId, refType } from '@code-to-json/utils';
import { mapDict } from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';
import { LinkedOutputMap, LinkedRefResolver, MaybeLinkedWalkerOutputData } from './types';

/**
 * @internal
 * @param dat multi-store
 */
export function createLinkedRefResolver(dat: MaybeLinkedWalkerOutputData): LinkedRefResolver {
  return function resolveReference<K extends keyof LinkedOutputMap>(
    ref?: Ref<K>,
  ): LinkedOutputMap[K] | undefined {
    if (!ref) {
      return undefined;
    }
    const rKind = refType(ref);
    const rId = refId(ref);
    return (dat as any)[`${rKind}s`][rId];
  };
}

export function resolveRefList<RefKind extends keyof LinkedOutputMap>(
  list: Array<Ref<RefKind>> | undefined,
  res: LinkedRefResolver,
): Array<LinkedOutputMap[RefKind]> | undefined {
  if (!list) {
    return undefined;
  }
  return list.map(res).filter(isDefined);
}

export function resolveRefDict<RefKind extends keyof LinkedOutputMap>(
  dict: Dict<Ref<RefKind>> | undefined,
  res: LinkedRefResolver,
): Dict<LinkedOutputMap[RefKind]> | undefined {
  if (!dict) {
    return undefined;
  }
  return mapDict(dict, res);
}
