import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class FunctionAnalysisTests {
  @test
  public async 'zero-argument function'(): Promise<void> {
    const code = "export function foo() { return 'bar'; }";
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const functionSymbol = t.resolveReference(fileSymbol.exports!.foo);
    expect(functionSymbol.text).to.eql('foo');
    expect(functionSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    const functionType = t.resolveReference(functionSymbol.valueDeclarationType);
    expect(functionType.text).to.eql('() => string');
    expect(functionType.flags).to.deep.eq(['Object']);
    expect(functionType.text).to.eql('() => string', 'has correct type');

    expect(functionType.callSignatures!.length).to.eql(1);
    const [callSig] = functionType.callSignatures!;
    expect(callSig.text).to.eql('(): string');
    expect(callSig.parameters).to.eql(undefined);
    expect(callSig.hasRestParameter).to.eql(false);
    const returnType = t.resolveReference(callSig.returnType!);
    expect(returnType.text).to.eq('string');

    t.cleanup();
  }

  @test
  public async 'function w/ rest param'(): Promise<void> {
    const code = "export function foo(...parts: string[]) { return parts.join(', '); }";
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const functionSymbol = t.resolveReference(fileSymbol.exports!.foo);
    expect(functionSymbol.text).to.eql('foo');
    expect(functionSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    const functionType = t.resolveReference(functionSymbol.valueDeclarationType);
    expect(functionType.text).to.eql('(...parts: string[]) => string');
    expect(functionType.flags).to.deep.eq(['Object']);

    expect(functionType.callSignatures!.length).to.eql(1);
    const [callSig] = functionType.callSignatures!;
    expect(callSig.text).to.eql('(...parts: string[]): string');
    expect(callSig.parameters!.length).to.eql(1);
    expect(callSig.hasRestParameter).to.eql(true);
    const [firstParamSym] = callSig.parameters!.map(p => t.resolveReference(p));
    expect(firstParamSym.name).to.eq('parts');
    const firstParamType = t.resolveReference(firstParamSym.valueDeclarationType);
    expect(firstParamType.text).to.eq('string[]');
    const returnType = t.resolveReference(callSig.returnType!);
    expect(returnType.text).to.eq('string');

    t.cleanup();
  }

  @test
  public async 'unary function'(): Promise<void> {
    const code = 'export function foo(str: string) { return str.toUpperCase(); }';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const functionSymbol = t.resolveReference(fileSymbol.exports!.foo);
    expect(functionSymbol.text).to.eql('foo');
    expect(functionSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    const functionType = t.resolveReference(functionSymbol.valueDeclarationType);
    expect(functionType.text).to.eql('(str: string) => string');
    expect(functionType.flags).to.deep.eq(['Object']);

    expect(functionType.callSignatures!.length).to.eql(1);
    const [callSig] = functionType.callSignatures!;
    expect(callSig.text).to.eql('(str: string): string');
    expect(callSig.parameters!.length).to.eql(1);
    expect(callSig.hasRestParameter).to.eql(false);
    const paramSym = t.resolveReference(callSig.parameters![0]);
    expect(paramSym.name).to.eq('str');
    const paramType = t.resolveReference(paramSym.valueDeclarationType);
    expect(paramType.text).to.eq('string');
    const returnType = t.resolveReference(callSig.returnType!);
    expect(returnType.text).to.eq('string');

    t.cleanup();
  }

  @test
  public async 'function with multiple signatures'(): Promise<void> {
    const code = `
    export function adder(a: string, b: string): string;
    export function adder(a: number, b: number): number;
    export function adder(a: number|string, b: number|string): number|string {
      return a + b;
    }
    `;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const functionSymbol = t.resolveReference(fileSymbol.exports!.adder);
    expect(functionSymbol.text).to.eql('adder');
    expect(functionSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    const functionType = t.resolveReference(functionSymbol.valueDeclarationType);
    expect(functionType.text).to.eql(
      '{ (a: string, b: string): string; (a: number, b: number): number; }',
    );
    expect(functionType.flags).to.deep.eq(['Object']);

    expect(functionType.callSignatures!.length).to.eql(2);

    const [callSig1, callSig2] = functionType.callSignatures!;
    expect(callSig1.text).to.eql('(a: string, b: string): string');
    expect(callSig1.parameters!.length).to.eql(2);
    const [sig1Param1, sig1Param2] = callSig1.parameters!.map(p => t.resolveReference(p));
    const [sig1Param1Type, sig1Param2Type] = [sig1Param1, sig1Param2].map(s =>
      t.resolveReference(s.valueDeclarationType),
    );
    expect(sig1Param1.name).to.eq('a');
    expect(sig1Param1Type.text).to.eq('string');
    expect(sig1Param2.name).to.eq('b');
    expect(sig1Param2Type.text).to.eq('string');
    const sig1ReturnType = t.resolveReference(callSig1.returnType!);
    expect(sig1ReturnType.text).to.eq('string');

    expect(callSig2.text).to.eql('(a: number, b: number): number');
    expect(callSig2.parameters!.length).to.eql(2);
    const [sig2Param1, sig2Param2] = callSig2.parameters!.map(p => t.resolveReference(p));
    const [sig2Param1Type, sig2Param2Type] = [sig2Param1, sig2Param2].map(s =>
      t.resolveReference(s.valueDeclarationType),
    );
    expect(sig2Param1.name).to.eq('a');
    expect(sig2Param1Type.text).to.eq('number');
    expect(sig2Param2.name).to.eq('b');
    expect(sig2Param2Type.text).to.eq('number');
    const sig2ReturnType = t.resolveReference(callSig2.returnType!);
    expect(sig2ReturnType.text).to.eq('number');

    t.cleanup();
  }
}
