import { DocBlockTag, DocNode, DocNodeKind, ModifierTagSet } from '@microsoft/tsdoc';
import { CommentInlineTag } from 'types';

function parseDocBlockTag(blockTag: DocBlockTag): CommentInlineTag {
  function parse(node: DocNode): void {
    switch (node.kind) {
      case DocNodeKind.Excerpt:
        break;
      default:
        throw new Error(`Didn't expect to find node of kind ${node.kind} in a DocBlockTag`);
    }
  }

  blockTag.getChildNodes().forEach(parse);
  return {
    tagName: blockTag.tagName,
    kind: 'inlineTag',
  };
}

export default function parseModifierTagSet(tagSet: ModifierTagSet): CommentInlineTag[] {
  return tagSet.nodes.map(parseDocBlockTag);
}
