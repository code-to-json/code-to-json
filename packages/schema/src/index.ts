// tslint:disable-next-line:no-var-requires
import * as fs from 'fs';
import * as path from 'path';
import * as stripJsonComments from 'strip-json-comments';

const apiExtractorSchema = fs
  .readFileSync(
    path.join(
      __dirname,
      '..',
      '..',
      '..',
      'node_modules/@microsoft/api-extractor/lib/api/api-json.schema.json'
    )
  )
  .toString();

export const formattedSchema = Object.freeze(stripJsonComments(apiExtractorSchema));
