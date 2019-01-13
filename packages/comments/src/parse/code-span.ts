import { DocCodeSpan } from '@microsoft/tsdoc';
import { CommentInlineCode } from 'types';

export default function parseCodeSpan(cs: DocCodeSpan): CommentInlineCode {
  return { kind: 'inlineCode', code: cs.code };
}
