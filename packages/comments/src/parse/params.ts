import { DocNodeKind, DocParagraph, DocParamCollection, DocSection } from '@microsoft/tsdoc';
import { CommentParagraphContent, CommentParam } from '../types';
import parseParagraph from './paragraph';
import { extractParamDescription, trimParagraphContent } from './utils';

function parseTagSection(_tagName: string, node: DocSection): CommentParagraphContent {
  const parts: CommentParagraphContent = [];
  node.getChildNodes().forEach((ch) => {
    const { kind: k } = ch;
    switch (k) {
      case DocNodeKind.Paragraph:
        return parts.push(...parseParagraph(ch as DocParagraph));
      default:
        throw new Error(`Didn't expect to encounter a ${k} as a child of a DocSection`);
    }
  });
  return parts;
}

export default function parseParams(params: DocParamCollection): CommentParam[] {
  return params.blocks.map((p) => {
    const rawContent = parseTagSection('params', p.content);
    trimParagraphContent(rawContent);
    if (p.parameterName) {
      return {
        tagName: p.blockTag.tagName,
        name: p.parameterName,
        content: rawContent,
        kind: 'param' as 'param',
      };
    }
    const { name, type, content, raw } = extractParamDescription(
      'param',
      rawContent.join('').split('\n')[0],
    );
    trimParagraphContent(content);
    const basic: CommentParam = {
      tagName: p.blockTag.tagName.replace('@', ''),
      name,
      content,
      kind: 'param' as 'param',
    };
    if (typeof raw !== 'undefined') {
      basic.raw = raw;
    }
    return type ? { ...basic, type } : basic;
  });
}
