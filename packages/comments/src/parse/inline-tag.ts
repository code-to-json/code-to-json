import { DocExcerpt, DocInlineTag, DocNode, DocNodeKind } from '@microsoft/tsdoc';
import { CommentInlineTag } from 'types';

export default function parseInlineTag(tag: DocInlineTag): CommentInlineTag {
  const { tagName, tagContent: content } = tag;
  return {
    tagName,
    content: [content],
  };
}
