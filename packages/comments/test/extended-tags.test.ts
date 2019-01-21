import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { parseCommentString } from '../src/index';

@suite
export class ExtendedTagsTests {
  @test
  public 'modifier tags'(): void {
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @author Mike
 */`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      customTags: [
        {
          content: ['Mike'],
          kind: 'blockTag',
          tagName: 'author',
        },
      ],
    });
    expect(
      parseCommentString(`
/**
 * This is only a comment in a file
 *
 * @file foo
 */`),
    ).to.deep.eq({
      summary: ['This is only a comment in a file'],
      customTags: [
        {
          content: ['foo'],
          kind: 'blockTag',
          tagName: 'file',
        },
      ],
    });
  }
}
