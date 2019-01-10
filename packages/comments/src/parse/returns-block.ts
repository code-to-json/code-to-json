import { DocBlock, DocErrorText, DocNodeKind, DocParagraph, DocPlainText } from '@microsoft/tsdoc';
import { CommentParamDescription } from 'types';
import { extractParamDescription } from './utils';

function parseReturnsParagraph(paragraph: DocParagraph): string {
  return paragraph
    .getChildNodes()
    .map(n => {
      if (n.kind === DocNodeKind.PlainText) {
        return (n as DocPlainText).text;
      }
      if (n.kind === DocNodeKind.ErrorText) {
        return (n as DocErrorText).text;
      }
      if (n.kind === DocNodeKind.SoftBreak) {
        return '\n';
      }
      throw new Error(
        `Did not expect to find a ${n.kind} within a DocParagraph of a @returns DocBlock`,
      );
    })
    .join('')
    .trim();
}

export default function parseReturnsBlock(block?: DocBlock): CommentParamDescription | undefined {
  if (!block) {
    return undefined;
  }
  const { content } = block;
  const children = content.getChildNodes();
  const [firstChild, ...otherChildren] = children;
  if (firstChild.kind !== DocNodeKind.Paragraph) {
    throw new Error(
      `Expected first child of a @returns DocBlock to be a Paragraph. Found ${
        firstChild.kind
      } instead`,
    );
  }
  const desc: CommentParamDescription = extractParamDescription(
    parseReturnsParagraph(firstChild as DocParagraph),
  );
  otherChildren.forEach(otherch => {
    if (otherch.kind !== DocNodeKind.Paragraph) {
      throw new Error(
        `Expected children of a @returns DocBlock to be a Paragraph. Found ${otherch.kind} instead`,
      );
    }
    desc.content += `\n${parseReturnsParagraph(otherch as DocParagraph)}`;
  });
  delete desc.name;
  delete desc.raw;
  return desc;
}
