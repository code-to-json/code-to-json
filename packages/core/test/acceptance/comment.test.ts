import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class CommentSerializationTests {
  @test
  public async 'basic comments'(): Promise<void> {
    const code = `interface Foo { num: number; }

    /**
     * A thing
     */
    export const x: Foo = { num: 4 };`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.text).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    expect(variableSymbol.documentation).to.deep.eq({
      summary: ['A thing'],
    });
    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('Foo', 'has correct type');

    t.cleanup();
  }

  @test
  public async 'with @see block tag'(): Promise<void> {
    const code = `interface Foo { num: number; }

    /**
     * A thing
     * @see Mike
     */
    export const x: Foo = { num: 4 };`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.x);
    expect(variableSymbol.text).to.eql('x');
    expect(variableSymbol.flags).to.eql(['BlockScopedVariable'], 'Regarded as a variable');

    expect(variableSymbol.documentation).to.deep.eq({
      summary: ['A thing'],
      customTags: [
        {
          content: ['Mike'],
          kind: 'blockTag',
          tagName: 'see',
        },
      ],
    });

    const variableType = t.resolveReference(variableSymbol.valueDeclarationType);
    expect(variableType.text).to.eql('Foo', 'has correct type');

    t.cleanup();
  }

  @test
  public async 'with @param tags'(): Promise<void> {
    const code = `interface Foo { num: number; }

    /**
     * Add two numbers
     * @param a first number
     * @param b second number
     */
    export function add(a: number, b: number) { return a + b; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const functionSymbol = t.resolveReference(fileSymbol.exports!.add);
    expect(functionSymbol.text).to.eql('add');
    expect(functionSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    expect(functionSymbol.documentation).to.deep.eq({
      summary: ['Add two numbers'],
      params: [
        {
          content: ['first number'],
          kind: 'param',
          name: 'a',
          tagName: 'param',
        },
        {
          content: ['second number'],
          kind: 'param',
          name: 'b',
          tagName: 'param',
        },
      ],
    });

    const functionType = t.resolveReference(functionSymbol.valueDeclarationType);
    expect(functionType.text).to.eql('(a: number, b: number) => number');
    const [callSig1] = functionType.callSignatures!;
    expect(callSig1.parameters!.length).to.eql(2);
    const [sig1Param1, sig1Param2] = callSig1.parameters!.map((p) => t.resolveReference(p));
    expect(sig1Param1.jsDocTags![0].name).to.eq('param');
    expect(sig1Param2.jsDocTags![0].name).to.eq('param');
    expect(sig1Param1.jsDocTags![0].text).contains('first number');
    expect(sig1Param2.jsDocTags![0].text).contains('second number');

    t.cleanup();
  }

  @test
  public async 'with an @example tag and fenced code example'(): Promise<void> {
    const code = `interface Foo { num: number; }

    /**
     * Add two numbers
     *
     * @example
     * \`\`\`ts
     * const x = add(4, 6); // 10
     * \`\`\`
     */
    export function add(a: number, b: number) { return a + b; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const functionSymbol = t.resolveReference(fileSymbol.exports!.add);

    expect(functionSymbol.documentation).to.deep.eq({
      summary: ['Add two numbers'],
      customTags: [
        {
          content: [
            {
              code: 'const x = add(4, 6); // 10\n',
              kind: 'fencedCode',
              language: 'ts',
            },
          ],
          kind: 'blockTag',
          tagName: 'example',
        },
      ],
    });
    t.cleanup();
  }

  @test
  public async 'with inline code'(): Promise<void> {
    const code = `interface Foo { num: number; }

    /**
     * Add two numbers
     *
     * \`const x = add(4, 6); // 10\`
     */
    export function add(a: number, b: number) { return a + b; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const functionSymbol = t.resolveReference(fileSymbol.exports!.add);

    expect(functionSymbol.documentation).to.deep.eq({
      summary: [
        'Add two numbers',
        '\n',
        '\n',
        {
          code: 'const x = add(4, 6); // 10',
          kind: 'inlineCode',
        },
      ],
    });
    t.cleanup();
  }

  @test
  public async 'with HTML tags'(): Promise<void> {
    const code = `interface Foo { num: number; }

    /**
     * Add two numbers
     *
     * <a data-name="foo" href="https://example.com">Example.com</a>
     *
     * And a picture
     *
     * <img src="https://example.com/foo.gif" />
     */
    export function add(a: number, b: number) { return a + b; }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const functionSymbol = t.resolveReference(fileSymbol.exports!.add);

    expect(functionSymbol.documentation).to.deep.eq({
      summary: [
        'Add two numbers',
        '\n',
        '\n',
        {
          attributes: [
            {
              name: 'data-name',
              value: '"foo"',
            },
            {
              name: 'href',
              value: '"https://example.com"',
            },
          ],
          isSelfClosingTag: false,
          kind: 'htmlStartTag',
          name: 'a',
        },
        'Example.com',
        {
          kind: 'htmlEndTag',
          name: 'a',
        },
        '\n',
        '\n',
        'And a picture',
        '\n',
        '\n',
        {
          attributes: [
            {
              name: 'src',
              value: '"https://example.com/foo.gif"',
            },
          ],
          isSelfClosingTag: true,
          kind: 'htmlStartTag',
          name: 'img',
        },
      ],
    });
    t.cleanup();
  }
}
