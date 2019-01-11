import { DocBlockTag, DocExcerpt, DocNode, DocNodeKind, ModifierTagSet } from '@microsoft/tsdoc';
import { CommentInlineTag } from 'types';

function parseDocBlockTag(blockTag: DocBlockTag): CommentInlineTag {
  function parse(node: DocNode): void {
    // tslint:disable-next-line:no-small-switch
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
  };
}

export default function parseModifierTagSet(tagSet: ModifierTagSet): CommentInlineTag[] {
  return tagSet.nodes.map(parseDocBlockTag);
}
