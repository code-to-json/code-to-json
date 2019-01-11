import { DocBlockTag, DocExcerpt, DocNode, DocNodeKind } from '@microsoft/tsdoc';
import { CommentBlockTag } from 'types';

export default function parseBlockTag(tag: DocBlockTag): CommentBlockTag {
  const { tagName } = tag;

  function parse(node: DocNode): void {
    // tslint:disable-next-line:no-small-switch
    switch (node.kind) {
      case DocNodeKind.Excerpt:
        // tslint:disable-next-line:no-commented-code
        // {
        //   const e = node as DocExcerpt;
        //   // TODO
        // }
        break;
      default:
        throw new Error(`Didn't expect to find a node of kind ${node.kind} in a DocBlockTag`);
    }
    node.getChildNodes().forEach(parse);
  }
  tag.getChildNodes().forEach(parse);

  return {
    tagName: tagName.replace('@', ''),
  };
}
