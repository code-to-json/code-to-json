import parser from '../parser';
import { CommentData } from '../types';
import parseParams from './params';
import parseSummarySection from './summary-section';

export function parseCommentString(str: string): CommentData {
  const parsed = parser.parseString(str);
  const { summarySection, params: prams } = parsed.docComment;
  const summary = parseSummarySection(summarySection).trim();
  const data: CommentData = { summary };
  const params = parseParams(prams);
  if (params.length > 0) {
    data.params = params;
  }
  return data;
}
