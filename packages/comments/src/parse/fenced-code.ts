import { DocFencedCode } from '@microsoft/tsdoc';
import { CommentFencedCode } from 'types';

export default function parseFencedCode(fencedCode: DocFencedCode): CommentFencedCode {
  const { language, code } = fencedCode;
  return { language, code, kind: 'fencedCode' };
}
