import { CommentInlineTag, CommentParagraphContent, CommentParam } from 'types';

const JSDOC_PARAM_CONTENT_REGEX = /^([\S^{])?\s*\{(.*)\}\s*([\s\S]*)$/m;
const TS_PARAM_CONTENT_REGEX = /^\s*([\w_.]+)\s+(.*)\s*$/m;

export function extractParamDescription(rawRagName: string, s: string): CommentParam {
  const tagName = rawRagName.replace('@', '');
  const jsdocMatch = JSDOC_PARAM_CONTENT_REGEX.exec(s.trim());
  if (jsdocMatch) {
    const [, name, type, content] = jsdocMatch;
    return { tagName, name, type, content: [content] };
  }
  const tsMatch = TS_PARAM_CONTENT_REGEX.exec(s);
  if (tsMatch) {
    const [, name, content] = tsMatch;
    return { tagName, name, content: [content] };
  }
  return { tagName, name: '(unknown)', content: [s] };
}

function isEmpty(element: CommentInlineTag | string): boolean {
  return typeof element === 'string' && /^[\s\n]*$/m.test(element);
}

export function trimParagraphContent(
  p?: CommentParagraphContent,
): CommentParagraphContent | undefined {
  if (!p) {
    return p;
  }
  let removeFromBeginning = 0;
  while (removeFromBeginning < p.length && isEmpty(p[removeFromBeginning])) {
    removeFromBeginning++;
  }
  let removeFromEnd = 0;
  while (removeFromEnd < p.length && isEmpty(p[p.length - 1 - removeFromEnd])) {
    removeFromEnd++;
  }
  if (removeFromBeginning > 0) {
    p.splice(0, removeFromBeginning);
  }
  if (removeFromEnd > 0) {
    p.splice(p.length - removeFromEnd, removeFromEnd);
  }
  return p;
}
