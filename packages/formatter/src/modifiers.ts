import { Dict } from '@mike-north/types';

const MODIFIER_MAP: Dict<string> = {
  ExportKeyword: 'export',
  ProtectedKeyword: 'protected',
  PublicKeyword: 'public',
  PrivateKeyword: 'private',
};

export function mapModifier(raw: string): string {
  const mapped = MODIFIER_MAP[raw];
  if (mapped) {
    return mapped;
  }
  return raw.toLowerCase().replace('Keyword', '');
}
