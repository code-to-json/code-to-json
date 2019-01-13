import {
  DocBlockTag,
  DocCodeSpan,
  DocErrorText,
  DocInlineTag,
  DocLinkTag,
  DocNode,
  DocNodeKind,
  DocParagraph,
  DocPlainText,
} from '@microsoft/tsdoc';
import * as debug from 'debug';
import { CommentParagraphContent } from 'types';
import parseBlockTag from './block-tag';
import parseCodeSpan from './code-span';
import parseInlineTag from './inline-tag';
import parseLinkTag from './link-tag';

const log = debug('code-to-json:comments:paragraph');

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
      case DocNodeKind.HtmlStartTag:
        // TODO
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
      default:
        throw new Error(`Didn't expect to find a node of kind ${node.kind} in a DocParagraph`);
    }
    node.getChildNodes().forEach(parse);
  }

  p.getChildNodes().forEach(parse);

  return parts;
}
