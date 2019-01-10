import { DocBlockTag, ModifierTagSet } from '@microsoft/tsdoc';

function parseDocBlockTag(blockTag: DocBlockTag): string {
  return blockTag.tagName;
}

export default function parseModifierTagSet(tagSet: ModifierTagSet): string[] {
  return tagSet.nodes.map(parseDocBlockTag);
}
