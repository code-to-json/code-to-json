import { DocBlockTag, DocNode, DocNodeKind } from '@microsoft/tsdoc';
import { CommentBlockTag } from 'types';

export default function parseBlockTag(tag: DocBlockTag): CommentBlockTag {
  const { tagName } = tag;

  function parse(node: DocNode): void {
    switch (node.kind) {
      case DocNodeKind.Excerpt:
        break;
      default:
        throw new Error(`Didn't expect to find a node of kind ${node.kind} in a DocBlockTag`);
    }
    node.getChildNodes().forEach(parse);
  }
  tag.getChildNodes().forEach(parse);

  return {
    kind: 'blockTag',
    tagName: tagName.replace('@', ''),
  };
}
