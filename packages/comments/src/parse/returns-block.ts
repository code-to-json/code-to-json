import { DocBlock, DocErrorText, DocNodeKind, DocParagraph, DocPlainText } from '@microsoft/tsdoc';
import { CommentParam } from '../types';
import parseParagraph from './paragraph';
import { extractParamDescription, trimParagraphContent } from './utils';

function isString(val: any): val is string {
  return typeof val === 'string';
}

export default function parseReturnsBlock(block?: DocBlock): CommentParam | undefined {
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
  const parsedFirstParagraph = parseParagraph(firstChild as DocParagraph);
  let firstNewline = 0;
  while (
    firstNewline < parsedFirstParagraph.length &&
    parsedFirstParagraph[firstNewline] !== '\n'
  ) {
    firstNewline++;
  }

  if (firstNewline > 0) {
    parsedFirstParagraph.splice(
      0,
      firstNewline,
      parsedFirstParagraph
        .slice(0, firstNewline)
        .join('')
        .trim(),
    );
  }

  const st = parsedFirstParagraph.filter(isString);
  const [stFirst, ...stRest] = st;
  const desc: CommentParam = extractParamDescription('returns', stFirst);
  desc.content = desc.content ? desc.content.concat(stRest) : stRest;
  otherChildren.forEach(otherch => {
    if (otherch.kind !== DocNodeKind.Paragraph) {
      throw new Error(
        `Expected children of a @returns DocBlock to be a Paragraph. Found ${otherch.kind} instead`,
      );
    }
    desc.content = desc.content
      ? desc.content.concat(...parseParagraph(otherch as DocParagraph))
      : parseParagraph(otherch as DocParagraph);
    trimParagraphContent(desc.content);
  });
  delete desc.name;
  delete desc.raw;
  return desc;
}
