// tslint:disable no-small-switch
import {
  DocErrorText,
  DocNodeKind,
  DocParamCollection,
  DocPlainText,
  DocSection,
} from '@microsoft/tsdoc';
import { CommentParam } from '../types';
import { extractParamDescription } from './utils';

function parseTagSection(tagName: string, node: DocSection): string {
  return node.getChildNodes().reduce((str, ch) => {
    const { kind: k } = ch;
    switch (k) {
      case DocNodeKind.Paragraph:
        return (
          str +
          ch.getChildNodes().reduce((s, gch) => {
            const { kind } = gch;
            switch (kind) {
              case DocNodeKind.PlainText:
                return s + (gch as DocPlainText).text;
              case DocNodeKind.SoftBreak:
                return `${s}\n`;
              case DocNodeKind.ErrorText:
                return s + (gch as DocErrorText).text;
              default:
                throw new Error(
                  `Didn't expect to encounter a ${kind} as a child of a DocParagraph`,
                );
            }
          }, '')
        );
      default:
        throw new Error(`Didn't expect to encounter a ${k} as a child of a DocSection`);
    }
  }, '');
}

export default function parseParams(params: DocParamCollection): CommentParam[] {
  return params.blocks.map(p => {
    const rawContent = parseTagSection('params', p.content).trim();
    if (p.parameterName) {
      return { tagName: p.blockTag.tagName, name: p.parameterName, content: rawContent };
    }
    const { name, type, content, raw } = extractParamDescription(rawContent);
    const basic: CommentParam = {
      tagName: p.blockTag.tagName,
      name,
      content,
    };
    if (typeof raw !== 'undefined') {
      basic.raw = raw;
    }
    return type ? { ...basic, type } : basic;
  });
}
