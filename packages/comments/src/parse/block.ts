import { DocBlock } from '@microsoft/tsdoc';
import { CommentParagraphContent } from 'types';
import parseDocSection from './section';
import { trimParagraphContent } from './utils';

interface ParsedDocBlock {
  tag: string;
  content?: CommentParagraphContent;
}

export default function parseDocBlock(block?: DocBlock): ParsedDocBlock | undefined {
  if (!block) {
    return undefined;
  }
  const { blockTag, content } = block;
  const parsedContent = parseDocSection(content);
  trimParagraphContent(parsedContent);

  return { tag: blockTag.tagName.replace('@', ''), content: parsedContent };
}
