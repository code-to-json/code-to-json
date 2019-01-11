import { CommentData } from '@code-to-json/comments';
import * as ts from 'typescript';
import { Flags } from './flags';
import { SourceFileRef } from './processing-queue/ref';

export interface EntityMap {
  declaration: ts.Declaration;
  symbol: ts.Symbol;
  type: ts.Type;
  node: ts.Node;
  sourceFile: ts.SourceFile;
}

export interface SerializedEntity<THING extends string> {
  entity: THING;
  id: string;
  flags?: Flags;
  text?: string;
  name?: string;
}

export type CodePoisition = [string, number, number];
export type CodeRange = [string, number, number, number, number];

export interface HasPosition {
  sourceFile?: SourceFileRef;
  location: CodeRange;
}

export interface HasDocumentation {
  documentation?: CommentData;
  comment?: string;
}
