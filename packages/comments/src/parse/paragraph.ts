import { DocNode, DocNodeKind, DocParagraph, DocPlainText } from '@microsoft/tsdoc';

export default function parseParagraph(p: DocParagraph): string | undefined {
  if (!p) {
    return undefined;
  }
  const textParts: string[] = [];

  function parse(node: DocNode): void {
    switch (node.kind) {
      case DocNodeKind.Paragraph:
        textParts.push(parseParagraph(node as DocParagraph) || '');
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
        throw new Error(`Didn't expect to find a node of kind ${node.kind} in a DocParagraph`);
    }
    node.getChildNodes().forEach(parse);
  }

  p.getChildNodes().forEach(parse);

  return textParts.join('\n').trim();
}
