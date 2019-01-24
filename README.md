# code-to-json

[![Build Status](https://travis-ci.org/code-to-json/code-to-json.svg?branch=master)](https://travis-ci.org/code-to-json/code-to-json)
[![Build Status](https://dev.azure.com/code-to-json/code-to-json/_apis/build/status/code-to-json.code-to-json)](https://dev.azure.com/code-to-json/code-to-json/_build/latest?definitionId=1)
[![Version](https://img.shields.io/npm/v/code-to-json.svg)](https://www.npmjs.com/package/code-to-json)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d5eb027316894c8c9099fc8ca62c16b1)](https://app.codacy.com/app/code-to-json/code-to-json?utm_source=github.com&utm_medium=referral&utm_content=code-to-json/code-to-json&utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/code-to-json/code-to-json/branch/master/graph/badge.svg)](https://codecov.io/gh/code-to-json/code-to-json)
[![Coverage Status](https://coveralls.io/repos/github/code-to-json/code-to-json/badge.svg)](https://coveralls.io/github/code-to-json/code-to-json)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/code-to-json/code-to-json.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/code-to-json/code-to-json/alerts/)

## Getting Started

```sh
# install this library
yarn add -D code-to-json
# generate JSON information about a TypeScript or JavaScript program
code-to-json \
  --program . \  # path to a folder containing a tsconfig.json
  --out ./docs \ # folder where output is written to
```

## CLI Options

### `--format`

This tool can generate two different formats of JSON. You may select one using the `--format` option`

| `--format`  | Notes                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `raw`       | Granular low-level data, including many details that relate to the filesystem the tool was run on (i.e,. absolute paths) |
| `formatted` | Higher-level data, intended for use in documentation tools                                                               |
| `both`      | Both `raw` and `formatted` data formats as individual files                                                              |

```sh
# using the --format flag to emit granular data
code-to-json --program ./my-lib --out ./docs --format raw
```

### `--out`

The path to a folder that will be used (or created, with all intermediate folders) to contain all of `code-to-json`'s output

### `--program`

Path to the root of a JavaScript or TypeScript project, which should contain both a valid `package.json` and a `tsconfig.json`

## Packages

- [@code-to-json/utils](https://github.com/code-to-json/code-to-json/tree/master/packages/utils) [![Version](https://img.shields.io/npm/v/@code-to-json/utils.svg)](https://www.npmjs.com/package/@code-to-json/utils) - Low level utilities, with no dependencies

- [@code-to-json/utils-ts](https://github.com/code-to-json/code-to-json/tree/master/packages/utils-ts) [![Version](https://img.shields.io/npm/v/@code-to-json/utils-ts.svg)](https://www.npmjs.com/package/@code-to-json/utils-ts) - TypeScript utilities

- [@code-to-json/utils-node](https://github.com/code-to-json/code-to-json/tree/master/packages/utils-node) [![Version](https://img.shields.io/npm/v/@code-to-json/utils-node.svg)](https://www.npmjs.com/package/@code-to-json/utils-node) - <b>[NODE]</b> Node.js utilities

- [@code-to-json/core](https://github.com/code-to-json/code-to-json/tree/master/packages/core) [![Version](https://img.shields.io/npm/v/@code-to-json/core.svg)](https://www.npmjs.com/package/@code-to-json/core) - Code analysis functionality

- [@code-to-json/formatter](https://github.com/code-to-json/code-to-json/tree/master/packages/formatter) [![Version](https://img.shields.io/npm/v/@code-to-json/formatter.svg)](https://www.npmjs.com/package/@code-to-json/formatter) - Data formatter

- [@code-to-json/comments](https://github.com/code-to-json/code-to-json/tree/master/packages/comments) [![Version](https://img.shields.io/npm/v/@code-to-json/comments.svg)](https://www.npmjs.com/package/@code-to-json/comments) - Comment-parsing functionality

- [@code-to-json/test-helpers](https://github.com/code-to-json/code-to-json/tree/master/packages/test-helpers) [![Version](https://img.shields.io/npm/v/@code-to-json/test-helpers.svg)](https://www.npmjs.com/package/@code-to-json/test-helpers) - <b>[NODE]</b> Testing helpers for running mocha in node

- [@code-to-json/schema](https://github.com/code-to-json/code-to-json/tree/master/packages/schema) [![Version](https://img.shields.io/npm/v/@code-to-json/schema.svg)](https://www.npmjs.com/package/@code-to-json/schema) - JSON schema for code-to-json output formats

- [@code-to-json/cli](https://github.com/code-to-json/code-to-json/tree/master/packages/cli) [![Version](https://img.shields.io/npm/v/@code-to-json/cli.svg)](https://www.npmjs.com/package/@code-to-json/cli) - <b>[NODE]</b> - CLI interface

© 2018 LinkedIn
