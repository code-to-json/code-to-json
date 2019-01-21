import {
  DocBlockTag,
  DocCodeSpan,
  DocErrorText,
  DocHtmlAttribute,
  DocHtmlEndTag,
  DocHtmlStartTag,
  DocInlineTag,
  DocLinkTag,
  DocNode,
  DocNodeKind,
  DocParagraph,
  DocPlainText,
} from '@microsoft/tsdoc';
import * as debug from 'debug';
import { CommentHTMLEndTag, CommentHTMLStartTag, CommentParagraphContent } from '../types';
import parseBlockTag from './block-tag';
import parseCodeSpan from './code-span';
import parseInlineTag from './inline-tag';
import parseLinkTag from './link-tag';

const log = debug('code-to-json:comments:paragraph');

function handleHTMLStartTag(node: DocHtmlStartTag): CommentHTMLStartTag {
  const { name, htmlAttributes, selfClosingTag } = node;
  const out: CommentHTMLStartTag = {
    kind: 'htmlStartTag',
    isSelfClosingTag: selfClosingTag,
    attributes: htmlAttributes.map(attr => ({ name: attr.name, value: attr.value })),
    name,
  };
  return out;
}

function handleHTMLEndTag(node: DocHtmlEndTag): CommentHTMLEndTag {
  const { name } = node;
  const out: CommentHTMLEndTag = {
    kind: 'htmlEndTag',
    name,
  };
  return out;
}

export default function parseParagraph(p: DocParagraph): CommentParagraphContent {
  const parts: CommentParagraphContent = [];
  function parse(node: DocNode): void {
    switch (node.kind) {
      case DocNodeKind.Paragraph:
        parts.push(...parseParagraph(node as DocParagraph));
        break;
      case DocNodeKind.SoftBreak:
        parts.push('\n');
        break;
      case DocNodeKind.PlainText:
        parts.push((node as DocPlainText).text.trim());
        break;
      case DocNodeKind.Excerpt:
        break;
      case DocNodeKind.LinkTag:
        parts.push(parseLinkTag(node as DocLinkTag));
        break;
      case DocNodeKind.DeclarationReference:
      case DocNodeKind.MemberReference:
      case DocNodeKind.MemberIdentifier:
        break;
      case DocNodeKind.ErrorText:
        {
          const lastIdx = parts.length - 1;
          const lastP = parts[lastIdx] as string;
          switch ((node as DocErrorText).text) {
            case '{':
              parts[lastIdx] = `${lastP} {`;
              break;
            case '}':
              parts[lastIdx] = `${lastP}} `;
              break;
            default:
              parts[lastIdx] = `${lastP}${(node as DocErrorText).text}`;
              break;
          }
        }
        break;
      case DocNodeKind.BlockTag:
        parts.push(parseBlockTag(node as DocBlockTag));
        break;
      case DocNodeKind.InlineTag:
        parts.push(parseInlineTag(node as DocInlineTag));
        break;
      case DocNodeKind.CodeSpan:
        parts.push(parseCodeSpan(node as DocCodeSpan));
        break;
      case DocNodeKind.HtmlStartTag:
        parts.push(handleHTMLStartTag(node as DocHtmlStartTag));
        break;
      case DocNodeKind.HtmlAttribute:
        break;
      case DocNodeKind.HtmlEndTag:
        parts.push(handleHTMLEndTag(node as DocHtmlEndTag));
        break;
      default:
        throw new Error(`Didn't expect to find a node of kind ${node.kind} in a DocParagraph`);
    }
    node.getChildNodes().forEach(parse);
  }

  p.getChildNodes().forEach(parse);

  return parts;
}
