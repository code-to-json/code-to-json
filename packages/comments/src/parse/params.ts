// tslint:disable no-small-switch
import {
  DocErrorText,
  DocNodeKind,
  DocParamCollection,
  DocPlainText,
  DocSection,
} from '@microsoft/tsdoc';
import { CommentParagraphContent, CommentParam } from '../types';
import { extractParamDescription, trimParagraphContent } from './utils';

function parseTagSection(tagName: string, node: DocSection): CommentParagraphContent {
  return node.getChildNodes().reduce(
    (arr, ch) => {
      const { kind: k } = ch;
      switch (k) {
        case DocNodeKind.Paragraph:
          return arr.concat(
            ch.getChildNodes().reduce(
              (a, gch) => {
                const { kind } = gch;
                switch (kind) {
                  case DocNodeKind.PlainText:
                    return a.concat([(gch as DocPlainText).text]);
                  case DocNodeKind.SoftBreak:
                    return a.concat('\n');
                  case DocNodeKind.ErrorText:
                    return a.concat((gch as DocErrorText).text);
                  default:
                    throw new Error(
                      `Didn't expect to encounter a ${kind} as a child of a DocParagraph`,
                    );
                }
              },
              [] as string[],
            ),
          );
        default:
          throw new Error(`Didn't expect to encounter a ${k} as a child of a DocSection`);
      }
    },
    [] as string[],
  );
}

export default function parseParams(params: DocParamCollection): CommentParam[] {
  return params.blocks.map(p => {
    const rawContent = parseTagSection('params', p.content);
    trimParagraphContent(rawContent);
    if (p.parameterName) {
      return { tagName: p.blockTag.tagName, name: p.parameterName, content: rawContent };
    }
    const { name, type, content, raw } = extractParamDescription(
      'param',
      rawContent.join('').split('\n')[0],
    );
    trimParagraphContent(content);
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
