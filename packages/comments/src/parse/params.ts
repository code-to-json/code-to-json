import { DocParamCollection } from '@microsoft/tsdoc';
import { CommentParam } from '../types';
import parseDocSection from './section';
import { extractParamDescription, trimParagraphContent } from './utils';

export default function parseParams(params: DocParamCollection): CommentParam[] {
  return params.blocks.map((p) => {
    const rawContent = parseDocSection(p.content);
    trimParagraphContent(rawContent);
    if (p.parameterName) {
      return {
        tagName: p.blockTag.tagName,
        name: p.parameterName,
        content: rawContent,
        kind: 'param' as 'param',
      };
    }
    const { name, type, content, raw } = extractParamDescription(
      'param',
      rawContent.join('').split('\n')[0],
    );
    trimParagraphContent(content);
    const basic: CommentParam = {
      tagName: p.blockTag.tagName.replace('@', ''),
      name,
      content,
      kind: 'param' as 'param',
    };
    if (typeof raw !== 'undefined') {
      basic.raw = raw;
    }
    return type ? { ...basic, type } : basic;
  });
}
