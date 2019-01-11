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
import { CommentInlineTag, CommentParagraphContent } from 'types';
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
        switch ((node as DocErrorText).text) {
          case '{':
            parts[parts.length - 1] = `${parts[parts.length - 1] as string} {`;
            break;
          case '}':
            parts[parts.length - 1] = `${parts[parts.length - 1] as string}} `;
            break;
          default:
            parts[parts.length - 1] = `${parts[parts.length - 1] as string}${
              (node as DocErrorText).text
            }`;
            break;
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
