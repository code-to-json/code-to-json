import parser from '../parser';
import { CommentData } from '../types';
import parseDocBlock from './block';
import parseModifierTagSet from './modifier-tag-set';
import parseParams from './params';
import parseReturnsBlock from './returns-block';
import parseDocSection from './section';

export function parseCommentString(str: string): CommentData {
  const parsed = parser.parseString(str);
  const {
    summarySection,
    params,
    modifierTagSet,
    returnsBlock,
    typeParams,
    remarksBlock,
    deprecatedBlock,
  } = parsed.docComment;
  const summary = (parseDocSection(summarySection) || '').trim();
  const data: CommentData = { summary };
  const parsedParams = parseParams(params);
  const parsedTypeParams = parseParams(typeParams);
  const modifierTags = parseModifierTagSet(modifierTagSet);
  const returns = parseReturnsBlock(returnsBlock);
  const remarks = parseDocBlock(remarksBlock);
  const deprecated = parseDocBlock(deprecatedBlock);
  if (parsedParams.length > 0) {
    data.params = parsedParams;
  }
  if (parsedTypeParams.length > 0) {
    data.typeParams = parsedTypeParams;
  }
  if (modifierTags.length > 0) {
    data.modifiers = modifierTags.map(t => t.replace('@', ''));
  }
  if (typeof returns !== 'undefined') {
    data.returns = returns;
  }
  if (typeof remarks !== 'undefined') {
    data.remarks = remarks.content ? remarks.content.trim() : undefined;
  }
  if (typeof deprecated !== 'undefined') {
    data.deprecated = deprecated.content;
  }
  return data;
}
