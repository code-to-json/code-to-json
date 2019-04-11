import {
  DocBlockTag,
  DocCodeSpan,
  DocErrorText,
  DocHtmlEndTag,
  DocHtmlStartTag,
  DocInlineTag,
  DocLinkTag,
  DocNode,
  DocNodeKind,
  DocParagraph,
  DocPlainText,
} from '@microsoft/tsdoc';
import { CommentHTMLEndTag, CommentHTMLStartTag, CommentParagraphContent } from '../types';
import parseBlockTag from './block-tag';
import parseCodeSpan from './code-span';
import parseInlineTag from './inline-tag';
import parseLinkTag from './link-tag';

function handleHTMLStartTag(node: DocHtmlStartTag): CommentHTMLStartTag {
  const { name, htmlAttributes, selfClosingTag } = node;
  const out: CommentHTMLStartTag = {
    kind: 'htmlStartTag',
    isSelfClosingTag: selfClosingTag,
    attributes: htmlAttributes.map((attr) => ({ name: attr.name, value: attr.value })),
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

function handleErrortext(node: DocErrorText, parts: CommentParagraphContent): void {
  const lastIdx = parts.length - 1;
  const lastP = parts[lastIdx] as string;
  switch (node.text) {
    case '{':
      // eslint-disable-next-line no-param-reassign
      parts[lastIdx] = `${lastP} {`;
      break;
    case '}':
      // eslint-disable-next-line no-param-reassign
      parts[lastIdx] = `${lastP}} `;
      break;
    default:
      // eslint-disable-next-line no-param-reassign
      parts[lastIdx] = `${lastP}${node.text}`;
      break;
  }
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
      case DocNodeKind.LinkTag:
        parts.push(parseLinkTag(node as DocLinkTag));
        break;
      case DocNodeKind.ErrorText:
        handleErrortext(node as DocErrorText, parts);
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
      case DocNodeKind.EscapedText:
        // TODO: handle escaped text
        break;
      case DocNodeKind.HtmlEndTag:
        parts.push(handleHTMLEndTag(node as DocHtmlEndTag));
        break;
      case DocNodeKind.Excerpt:
      case DocNodeKind.HtmlAttribute:
      case DocNodeKind.DeclarationReference:
      case DocNodeKind.MemberReference:
      case DocNodeKind.MemberIdentifier:
        break;
      default:
        throw new Error(`Didn't expect to find a node of kind ${node.kind} in a DocParagraph`);
    }
    node.getChildNodes().forEach(parse);
  }

  p.getChildNodes().forEach(parse);

  return parts;
}
