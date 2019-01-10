// tslint:disable no-small-switch
import { DocNodeKind, DocParagraph, DocPlainText, DocSection } from '@microsoft/tsdoc';

function parseSummaryParagraph(node: DocParagraph): string {
  return node.getChildNodes().reduce((str, ch) => {
    const { kind } = ch;
    switch (kind) {
      case DocNodeKind.PlainText:
        return str + (ch as DocPlainText).text;
      case DocNodeKind.SoftBreak:
        return `${str}\n`;
      case DocNodeKind.BlockTag:
        return str;
      default:
        throw new Error(`Didn't expect to encounter a ${kind} as a child of a DocParagraph`);
    }
  }, '');
}

export default function parseSummarySection(node: DocSection): string {
  return node.getChildNodes().reduce((str, ch) => {
    const { kind } = ch;
    switch (kind) {
      case DocNodeKind.Paragraph:
        return str + parseSummaryParagraph(ch as DocParagraph);
      default:
        throw new Error(`Didn't expect to encounter a ${kind} as a child of a DocSection`);
    }
  }, '');
}
