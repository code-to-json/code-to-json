export type CommentParagraphContent = Array<
  // tslint:disable-next-line:max-union-size
  CommentInlineTag | CommentLinkTag | CommentFencedCode | string
>;

export interface CommentInlineTag<C = string[]> {
  kind: 'inlineTag';
  tagName: string;
  content?: C;
  raw?: string;
}

export interface CommentLinkTag
  extends Pick<CommentInlineTag, Exclude<keyof CommentInlineTag, 'kind'>> {
  kind: 'linkTag';
  url?: string;
}

export interface CommentBlockTag
  extends Pick<
    CommentInlineTag<CommentParagraphContent>,
    Exclude<keyof CommentInlineTag<CommentParagraphContent>, 'kind'>
  > {
  kind: 'blockTag';
}

export interface CommentParam
  extends Pick<CommentBlockTag, Exclude<keyof CommentBlockTag, 'kind'>> {
  kind: 'param';
  name?: string;
  type?: string;
}

export interface CommentFencedCode {
  kind: 'fencedCode';
  language: string;
  code: string;
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
