// tslint:disable no-duplicate-string

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { parseCommentString } from '../src/index';

@suite
class JSDocCodeBlockTests {
  @test
  public 'fenced code'(): void {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * \`\`\`ts
 * function foo() {}
 * \`\`\`
 */
`),
    ).to.deep.eq({
      summary: [
        'This is only a comment in a file',
        '\n',
        '\n',
        {
          code: 'function foo() {}\n',
          kind: 'fencedCode',
          language: 'ts',
        },
      ],
    });
  }
}
