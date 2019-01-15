import { Dict } from '@mike-north/types';

const DECORATOR_MAP: Dict<string> = {};

export function mapDecorator(raw: string): string {
  const mapped = DECORATOR_MAP[raw];
  if (mapped) {
    return mapped;
  }
  return raw.toLowerCase().replace('Keyword', '');
}
