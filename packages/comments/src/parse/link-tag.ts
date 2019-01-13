import { DocLinkTag } from '@microsoft/tsdoc';
import { CommentLinkTag } from '../types';

export default function parseLinkTag(lt: DocLinkTag): CommentLinkTag {
  // TODO code destination and other link types
  return {
    tagName: lt.tagName,
    content: lt.linkText ? [lt.linkText] : [],
    url: lt.urlDestination,
    kind: 'linkTag',
  };
}
