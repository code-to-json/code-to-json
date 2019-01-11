import {
  DocBlockTag,
  DocErrorText,
  DocInlineTag,
  DocLinkTag,
  DocNode,
  DocNodeKind,
  DocParagraph,
  DocPlainText,
} from '@microsoft/tsdoc';
import { CommentParagraphContent } from 'types';
import parseBlockTag from './block-tag';
import parseInlineTag from './inline-tag';

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
        {
          const l = node as DocLinkTag;
          // TODO code destination and other link types
          parts.push({
            tagName: l.tagName,
            content: l.linkText ? [l.linkText] : [],
            url: l.urlDestination,
            kind: 'linkTag',
          });
        }
        break;
      case DocNodeKind.DeclarationReference:
        // TODO
        break;
      case DocNodeKind.MemberReference:
        // TODO
        break;
      case DocNodeKind.MemberIdentifier:
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
        parseBlockTag(node as DocBlockTag);
        break;
      case DocNodeKind.InlineTag:
        parseInlineTag(node as DocInlineTag);
        break;
      default:
        throw new Error(`Didn't expect to find a node of kind ${node.kind} in a DocParagraph`);
    }
    node.getChildNodes().forEach(parse);
  }

  p.getChildNodes().forEach(parse);

  return parts;
}
