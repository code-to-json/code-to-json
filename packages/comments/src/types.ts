export interface CommentInlineTag {
  tagName: string;
  raw?: string;
}

export interface CommentParam extends CommentInlineTag, CommentParamDescription {
  name?: string;
  type?: string;
  content: string;
}

export interface CommentData {
  summary: string;
  params?: CommentParam[];
  typeParams?: CommentParam[];
  modifiers?: string[];
  remarks?: string;
  deprecated?: string;
  returns?: any;
}

export interface CommentParamDescription {
  name?: string;
  type?: string;
  content: string;
  raw?: string;
}