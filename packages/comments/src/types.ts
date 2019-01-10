export interface CommentInlineTag {
  tagName: string;
  raw?: string;
}

export interface CommentParam extends CommentInlineTag {
  name: string;
  content: string;
  type?: string;
}

export interface CommentData {
  summary: string;
  params?: CommentParam[];
}
