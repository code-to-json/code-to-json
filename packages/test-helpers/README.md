# @code-to-json/test-helpers

[![Build Status](https://travis-ci.org/code-to-json/code-to-json.svg?branch=master)](https://travis-ci.org/code-to-json/code-to-json)
[![Build Status](https://dev.azure.com/code-to-json/code-to-json/_apis/build/status/code-to-json.code-to-json)](https://dev.azure.com/code-to-json/code-to-json/_build/latest?definitionId=1)
[![Version](https://img.shields.io/npm/v/@code-to-json/test-helpers.svg)](https://www.npmjs.com/package/@code-to-json/test-helpers)
[![codecov](https://codecov.io/gh/code-to-json/code-to-json/branch/master/graph/badge.svg)](https://codecov.io/gh/code-to-json/code-to-json/tree/master/packages/test-helpers/src)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/code-to-json/code-to-json.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/code-to-json/code-to-json/alerts/)

This package contains a variety of test helpers, useful for testing tools built on top of the TypeScript compiler API in general, and [code-to-json](https://github.com/code-to-json/code-to-json) in particular

## Usage

### `createTempFixtureFolder`

Create collection of files and folders in your OS system temp folder

You may either refer to an existing folder on disk

```ts
import { createTempFixtureFolder } from '@code-to-json/test-helpers';

// Create the test case in your system temp folder
const { rootPath, cleanup } = await createTempFixtureFolder('path/to/my/fixture/on/disk');

cleanup(); // Completely delete the test case from disk
```

or describe your fixture using a plain JS/TS object

```ts
import { createTempFixtureFolder } from '@code-to-json/test-helpers';

// Create the test case in your system temp folder
const { rootPath, cleanup } = await createTempFixtureFolder({
  // ./tsconfig.json
  'tsconfig.json': `
{
  "compilerOptions": {
    "noEmit": true,
    "module": "es6",
    "target": "es2015"
  },
  "include": ["src"]
}
  `,
  src: {
    // ./src/index.ts
    'index.ts': `
/**
* This is a variable with an explicit type
*/
const constWithExplicitType: string = 'foo';
`,
  },
});

cleanup(); // Completely delete the test case from disk
```

### `setupTestCase`

Create the same folder structure described above for `createTempFixtureFolder`, and also initialize it as a TypeScript program.

```ts
import * as ts from 'typescript';
import { setupTestCase } from '@code-to-json/test-helpers';

// Create the test case in your system temp folder
const program: ts.Program = await setupTestCase(
  /**
   * Root folder of the fixture on disk
   * (you can also provide a "fixture object" as described above)
   */
  'path/to/my/fixture/on/disk',
  /**
   * One or more entry points of your application. Any imports will be included
   * in the TS program as well
   */
  ['src/index.ts'],
);
```

## Versioning & Conventions

This library has a very strong commitment to [semantic versioning](https://semver.org/), and makes use of [conventional commits](https://conventionalcommits.org) to automatically generate changelogs, and to increment version numbers appropriately when publishing.

---

© 2018 LinkedIn
