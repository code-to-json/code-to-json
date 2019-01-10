import parser from '../parser';
import { CommentData } from '../types';
import parseModifierTagSet from './modifier-tag-set';
import parseParams from './params';
import parseReturnsBlock from './returns-block';
import parseSummarySection from './summary-section';

export function parseCommentString(str: string): CommentData {
  const parsed = parser.parseString(str);
  const { summarySection, params, modifierTagSet, returnsBlock } = parsed.docComment;
  const summary = parseSummarySection(summarySection).trim();
  const data: CommentData = { summary };
  const parsedParams = parseParams(params);
  const modifierTags = parseModifierTagSet(modifierTagSet);
  const returns = parseReturnsBlock(returnsBlock);
  if (parsedParams.length > 0) {
    data.params = parsedParams;
  }
  if (modifierTags.length > 0) {
    data.modifiers = modifierTags.map(t => t.replace('@', ''));
  }
  if (typeof returns !== 'undefined') {
    data.returns = returns;
  }
  return data;
}
