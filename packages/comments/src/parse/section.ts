import { DocNode, DocNodeKind, DocParagraph, DocPlainText, DocSection } from '@microsoft/tsdoc';
import parseParagraph from './paragraph';

export default function parseDocSection(section: DocSection): string | undefined {
  const textParts: string[] = [];

  function parse(node: DocNode): void {
    switch (node.kind) {
      case DocNodeKind.Paragraph:
        textParts.push(parseParagraph(node as DocParagraph));
        break;
      case DocNodeKind.SoftBreak:
        textParts.push('\n');
        break;
      case DocNodeKind.PlainText:
        textParts.push((node as DocPlainText).text);
        break;
      case DocNodeKind.Excerpt:
        break;
      default:
        throw new Error(`Didn't expect to find a node of kind ${node.kind} in a DocSection`);
    }
  }

  section.nodes.forEach(parse);
  return textParts.join('\n').trim();
}
