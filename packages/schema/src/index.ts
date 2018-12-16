// import * as fs from 'fs';
// import * as path from 'path';
// import * as stripJsonComments from 'strip-json-comments';

// const apiExtractorSchema = fs
//   .readFileSync(
//     path.join(
//       __dirname,
//       '..',
//       '..',
//       '..',
//       'node_modules/@microsoft/api-extractor/lib/api/api-json.schema.json'
//     )
//   )
//   .toString();

// It may be possible to consume the real schema if this is fixed
//  https://github.com/Microsoft/web-build-tools/issues/996
// Until then, and because the JSON format seems to be changing
// significantly with recent major releases (i.e., 6 -> 7), it's
// not a good use of time to try and align with the MS Format

// const STRIPPED = stripJsonComments(apiExtractorSchema);
// fs.writeFileSync(path.join(__dirname, 'temp.json'), STRIPPED);
export const formattedSchema = {};
