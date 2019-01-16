import { isArray, UnreachableError } from '@code-to-json/utils';
import { Flags } from '@code-to-json/utils-ts';

const FLAGS_TRANSLATION_MAP: { [k: string]: string } = {
  Class: 'class',
  Function: 'function',
  BlockScopedVariable: 'variable',
  ValueModule: 'module',
  Property: 'property',
  Method: 'method',
  Alias: 'alias',
  TypeAlias: 'typeAlias',
  Object: 'object',
  Void: 'void',
  Reference: 'reference',
  NumberLiteral: 'numberLiteral',
  Number: 'number',
  String: 'string',
  Interface: 'interface',
  Prototype: 'prototype',
  Constructor: 'constructor',
  TypeParameter: 'typeParameter',
};

function formatFlag(flagString: string): string {
  return FLAGS_TRANSLATION_MAP[flagString] || flagString;
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
