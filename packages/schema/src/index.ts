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

// const STRIPPED = stripJsonComments(apiExtractorSchema);

export const formattedSchema = {};
