import { isArray, UnreachableError } from '@code-to-json/utils';
import { Flags } from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';

const FLAGS_TRANSLATION_MAP: Dict<string> = {
  Function: 'function',
  BlockScopedVariable: 'variable',
  ValueModule: 'module',
};

function formatFlag(flagString: string): string {
  const str = FLAGS_TRANSLATION_MAP[flagString] || flagString;
  return `${str[0].toLowerCase()}${str.substr(1)}`;
}

export default function formatFlags(flags?: Flags): string[] {
  if (isArray(flags)) {
    return flags.map(formatFlag);
  }
  if (typeof flags === 'string') {
    return [formatFlag(flags)];
  }
  if (typeof flags === 'undefined') {
    return [];
  }
  throw new UnreachableError(flags);
}
