# @code-to-json/comments

Parse JSDoc or TSDoc style comments into structured data

[![Build Status](https://travis-ci.org/code-to-json/code-to-json.svg?branch=master)](https://travis-ci.org/code-to-json/code-to-json)
[![Build Status](https://dev.azure.com/code-to-json/code-to-json/_apis/build/status/code-to-json.code-to-json)](https://dev.azure.com/code-to-json/code-to-json/_build/latest?definitionId=1)
[![Version](https://img.shields.io/npm/v/@code-to-json/comments.svg)](https://www.npmjs.com/package/@code-to-json/comments)
[![codecov](https://codecov.io/gh/code-to-json/code-to-json/branch/master/graph/badge.svg)](https://codecov.io/gh/code-to-json/code-to-json/tree/master/packages/comments/src)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/code-to-json/code-to-json.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/code-to-json/code-to-json/alerts/)

---

## Usage

First, install this package as a dependency

```sh
yarn add @code-to-json/comments
```

Then, import the `parseCommentString` function, and pass it stringified code comment

```ts
import { parseCommentString } from '@code-to-json/comments';

parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @example
 *
 * function foo() {}
 * foo(); // equal: undefined
 *
 */
`);
```

which should return a `CommentData` value like this

```json
{
  "summary": ["This is only a comment in a file"],
  "customTags": [
    {
      "content": ["function foo() {} ", "\n", "foo(); // equal: undefined"],
      "kind": "blockTag",
      "tagName": "example"
    }
  ]
}
```

© 2018 LinkedIn
