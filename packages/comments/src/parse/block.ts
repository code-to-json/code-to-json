import { DocBlock } from '@microsoft/tsdoc';
import parseDocSection from './section';

interface ParsedDocBlock {
  tag: string;
  content?: string;
}

export default function parseDocBlock(block?: DocBlock): ParsedDocBlock | undefined {
  if (!block) {
    return undefined;
  }
  const { blockTag, content } = block;
  const parsedContent = parseDocSection(content);
  return { tag: blockTag.tagName, content: parsedContent };
}
