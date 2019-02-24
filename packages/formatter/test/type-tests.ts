/* eslint-disable prefer-const */
import { FormatterOptions, FormatterOutput } from '../src/index';

// ensure the exported types exist
let x: FormatterOutput = { data: {} } as any;
let y: FormatterOptions = { data: {} } as any;

let yAsObject = y as object;
let xAsObject = x as object;

const {
  data: { sourceFiles },
} = x;

console.log(yAsObject, xAsObject, sourceFiles);
