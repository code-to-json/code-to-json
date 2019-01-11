export type CommentParagraphContent = Array<CommentInlineTag | CommentLinkTag | string>;

export interface CommentInlineTag<C = string[]> {
  tagName: string;
  content?: C;
  raw?: string;
}

export interface CommentLinkTag extends CommentInlineTag {
  url?: string;
}

export interface CommentBlockTag extends CommentInlineTag<CommentParagraphContent> {}

export interface CommentParam extends CommentBlockTag {
  name?: string;
  type?: string;
}

export interface CommentData {
  summary: CommentParagraphContent;
  params?: CommentParam[];
  typeParams?: CommentParam[];
  modifiers?: string[];
  remarks?: CommentParagraphContent;
  deprecated?: CommentParagraphContent;
  returns?: any;
  customTags?: CommentBlockTag[];
}
