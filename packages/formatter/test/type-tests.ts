/* eslint-disable prefer-const */
import { FormatterOptions, FormatterOutput } from '../src/index';

// ensure the exported types exist
let x!: FormatterOutput;
let y!: FormatterOptions;

let yAsObject = y as object;
let xAsObject = x as object;

const {
  data: { sourceFiles },
} = x;

console.log(yAsObject, xAsObject, sourceFiles);
