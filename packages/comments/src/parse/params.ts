// tslint:disable no-small-switch
import {
  DocErrorText,
  DocNodeKind,
  DocParamCollection,
  DocPlainText,
  DocSection,
} from '@microsoft/tsdoc';
import { CommentParam } from '../types';

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

const JSDOC_PARAM_CONTENT_REGEX = /^\s*([\w_.]+)\s*\{([^}]+)\}\s*(.*)/;
const TS_PARAM_CONTENT_REGEX = /^\s*([\w_.]+)\s+(.*)\s*$/;

function extractVariableNameAndTypeFromParamContent(
  s: string,
): { name: string; type?: string; content: string } {
  const jsdocMatch = JSDOC_PARAM_CONTENT_REGEX.exec(s);
  if (jsdocMatch) {
    const [, name, type, content] = jsdocMatch;
    return { name, type, content };
  }
  const tsMatch = TS_PARAM_CONTENT_REGEX.exec(s);
  if (tsMatch) {
    const [, name, content] = tsMatch;
    return { name, content };
  }
  return { name: '(unknown)', content: s };
}

export default function parseParams(params: DocParamCollection): CommentParam[] {
  return params.blocks.map(p => {
    const rawContent = parseTagSection('params', p.content).trim();
    if (p.parameterName) {
      return { tagName: p.blockTag.tagName, name: p.parameterName, content: rawContent };
    }
    const { name, type, content } = extractVariableNameAndTypeFromParamContent(rawContent);
    const basic = {
      tagName: p.blockTag.tagName,
      name,
      content,
    };
    return type ? { ...basic, type } : basic;
  });
}
