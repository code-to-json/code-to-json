// tslint:disable prefer-const
/* eslint-disable prefer-const */
import { FormattedOutput, FormatterOptions } from '../src/index';

// ensure the exported types exist
let x!: FormattedOutput;
let y!: FormatterOptions;

let yAsObject = y as object;
let xAsObject = x as object;

const { sourceFiles } = x;
