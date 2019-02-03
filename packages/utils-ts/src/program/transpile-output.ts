import { Program } from 'typescript';

/**
 * The result of a compiled typescript program
 * @public
 */
export default interface TranspileOuptut {
  program: Program;
  output: string;
}
