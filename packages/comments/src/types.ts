export type CommentParagraphContent = Array<
  | CommentBlockTag
  | CommentInlineTag
  | CommentLinkTag
  | CommentFencedCode
  | CommentInlineCode
  | CommentHTMLStartTag
  | CommentHTMLEndTag
  | string
>;

export interface CommentParagraphContentBase<K> {
  kind: K;
}

export interface CommentInlineTag<C = string[]> extends CommentParagraphContentBase<'inlineTag'> {
  tagName: string;
  content?: C;
  raw?: string;
}

export interface CommentLinkTag
  extends CommentParagraphContentBase<'linkTag'>,
    Pick<CommentInlineTag, Exclude<keyof CommentInlineTag, 'kind'>> {
  url?: string;
}

export interface CommentBlockTag
  extends CommentParagraphContentBase<'blockTag'>,
    Pick<
      CommentInlineTag<CommentParagraphContent>,
      Exclude<keyof CommentInlineTag<CommentParagraphContent>, 'kind'>
    > {}

export interface CommentParam
  extends CommentParagraphContentBase<'param'>,
    Pick<CommentBlockTag, Exclude<keyof CommentBlockTag, 'kind'>> {
  name?: string;
  type?: string;
}

export interface CommentFencedCode extends CommentParagraphContentBase<'fencedCode'> {
  language: string;
  code: string;
}

export interface CommentInlineCode extends CommentParagraphContentBase<'inlineCode'> {
  code: string;
}

export interface CommentHTMLEndTag extends CommentParagraphContentBase<'htmlEndTag'> {
  name: string;
}

export interface CommentHTMLStartTag extends CommentParagraphContentBase<'htmlStartTag'> {
  name: string;
  isSelfClosingTag: boolean;
  attributes?: Array<{ name: string; value: string }>;
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
