import { CommentParamDescription } from 'types';

const JSDOC_PARAM_CONTENT_REGEX = /^([\S^{])?\s*\{(.*)\}\s*([\s\S]*)$/m;
const TS_PARAM_CONTENT_REGEX = /^\s*([\w_.]+)\s+(.*)\s*$/m;

export function extractParamDescription(s: string): CommentParamDescription {
  const jsdocMatch = JSDOC_PARAM_CONTENT_REGEX.exec(s.trim());
  if (jsdocMatch) {
    const [, name, type, content] = jsdocMatch;
    return { name, type, content };
  }
  const tsMatch = TS_PARAM_CONTENT_REGEX.exec(s);
  if (tsMatch) {
    const [, name, content] = tsMatch;
    return { name, content };
  }
  return { name: '(unknown)', content: s };
}
