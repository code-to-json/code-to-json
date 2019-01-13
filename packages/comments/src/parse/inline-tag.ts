import { DocInlineTag } from '@microsoft/tsdoc';
import { CommentInlineTag } from '../types';

export default function parseInlineTag(tag: DocInlineTag): CommentInlineTag {
  const { tagName, tagContent: content } = tag;
  return {
    tagName,
    kind: 'inlineTag',
    content: [content],
  };
}
