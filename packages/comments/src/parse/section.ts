import {
  DocFencedCode,
  DocNode,
  DocNodeKind,
  DocParagraph,
  DocPlainText,
  DocSection,
} from '@microsoft/tsdoc';
import { CommentParagraphContent } from 'types';
import parseFencedCode from './fenced-code';
import parseParagraph from './paragraph';

export default function parseDocSection(section: DocSection): CommentParagraphContent {
  const parts: CommentParagraphContent = [];

  function parse(node: DocNode): void {
    switch (node.kind) {
      case DocNodeKind.Paragraph:
        parts.push(...parseParagraph(node as DocParagraph));
        break;
      case DocNodeKind.FencedCode:
        parts.push(parseFencedCode(node as DocFencedCode));
        break;
      case DocNodeKind.SoftBreak:
        parts.push('\n');
        break;
      case DocNodeKind.PlainText:
        parts.push((node as DocPlainText).text);
        break;
      case DocNodeKind.Excerpt:
        break;
      default:
        throw new Error(`Didn't expect to find a node of kind ${node.kind} in a DocSection`);
    }
  }

  section.nodes.forEach(parse);
  return parts;
}
