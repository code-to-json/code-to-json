import { isDefined } from '@code-to-json/utils';
import parser from '../parser';
import { CommentBlockTag, CommentData } from '../types';
import parseDocBlock from './block';
import parseModifierTagSet from './modifier-tag-set';
import parseParams from './params';
import parseReturnsBlock from './returns-block';
import parseDocSection from './section';
import { trimParagraphContent } from './utils';

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
    customBlocks,
  } = parsed.docComment;
  const summary = parseDocSection(summarySection);
  trimParagraphContent(summary);
  const data: CommentData = { summary };
  const parsedParams = parseParams(params);
  const parsedTypeParams = parseParams(typeParams);
  const modifierTags = parseModifierTagSet(modifierTagSet);
  const returns = parseReturnsBlock(returnsBlock);
  const remarks = parseDocBlock(remarksBlock);
  const deprecated = parseDocBlock(deprecatedBlock);
  const customTags = customBlocks.map(b => parseDocBlock(b)).filter(isDefined);
  if (parsedParams.length > 0) {
    data.params = parsedParams;
  }
  if (parsedTypeParams.length > 0) {
    data.typeParams = parsedTypeParams;
  }
  if (modifierTags.length > 0) {
    data.modifiers = modifierTags.map(t => t.tagName.replace('@', ''));
  }
  if (typeof returns !== 'undefined') {
    data.returns = returns;
  }
  if (typeof remarks !== 'undefined') {
    data.remarks = remarks.content;
  }
  if (typeof deprecated !== 'undefined' && deprecated.content) {
    data.deprecated = deprecated.content;
  }
  if (customTags.length > 0) {
    data.customTags = customTags.map<CommentBlockTag>(t => {
      trimParagraphContent(t.content);
      return {
        tagName: t.tag,
        kind: 'blockTag',
        content: t.content,
      };
    });
  }
  return data;
}
