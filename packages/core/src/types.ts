import * as ts from 'typescript';

export interface WalkData {
  typeRegistry: {
    [k: string]: any;
  };
  output: any[];
}
