import { expect } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
@timeout(1200)
export class FunctionAnalysisTests {
  @test
  public async 'zero-argument function'(): Promise<void> {
    const code = "export function foo() { return 'bar'; }";
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.foo);
    expect(variableSymbol.symbolString).to.eql('foo');
    expect(variableSymbol.typeString).to.eql('() => string', 'has correct type');
    expect(variableSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('() => string');
    expect(variableType.flags).to.deep.eq(['Object']);

    expect(variableType.callSignatures!.length).to.eql(1);
    const [callSig] = variableType.callSignatures!;
    expect(callSig.typeString).to.eql('(): string');
    expect(callSig.parameters).to.eql(undefined);
    expect(callSig.hasRestParameter).to.eql(false);
    const returnType = t.resolveReference(callSig.returnType!);
    expect(returnType.typeString).to.eq('string');

    t.cleanup();
  }

  @test
  public async 'function w/ rest param'(): Promise<void> {
    const code = "export function foo(...parts: string[]) { return parts.join(', '); }";
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.foo);
    expect(variableSymbol.symbolString).to.eql('foo');
    expect(variableSymbol.typeString).to.eql('(...parts: string[]) => string', 'has correct type');
    expect(variableSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('(...parts: string[]) => string');
    expect(variableType.flags).to.deep.eq(['Object']);

    expect(variableType.callSignatures!.length).to.eql(1);
    const [callSig] = variableType.callSignatures!;
    expect(callSig.typeString).to.eql('(...parts: string[]): string');
    expect(callSig.parameters!.length).to.eql(1);
    expect(callSig.hasRestParameter).to.eql(true);
    const [firstParamSym] = callSig.parameters!.map(p => t.resolveReference(p));
    expect(firstParamSym.name).to.eq('parts');
    expect(firstParamSym.typeString).to.eq('string[]');
    const returnType = t.resolveReference(callSig.returnType!);
    expect(returnType.typeString).to.eq('string');

    t.cleanup();
  }

  @test
  public async 'unary function'(): Promise<void> {
    const code = 'export function foo(str: string) { return str.toUpperCase(); }';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const variableSymbol = t.resolveReference(fileSymbol.exports!.foo);
    expect(variableSymbol.symbolString).to.eql('foo');
    expect(variableSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql('(str: string) => string');
    expect(variableType.flags).to.deep.eq(['Object']);

    expect(variableType.callSignatures!.length).to.eql(1);
    const [callSig] = variableType.callSignatures!;
    expect(callSig.typeString).to.eql('(str: string): string');
    expect(callSig.parameters!.length).to.eql(1);
    expect(callSig.hasRestParameter).to.eql(false);
    const paramSym = t.resolveReference(callSig.parameters![0]);
    expect(paramSym.name).to.eq('str');
    expect(paramSym.typeString).to.eq('string');
    const returnType = t.resolveReference(callSig.returnType!);
    expect(returnType.typeString).to.eq('string');

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
    const variableSymbol = t.resolveReference(fileSymbol.exports!.adder);
    expect(variableSymbol.symbolString).to.eql('adder');
    expect(variableSymbol.flags).to.eql(['Function'], 'Regarded as a function');

    const variableType = t.resolveReference(variableSymbol.type);
    expect(variableType.typeString).to.eql(
      '{ (a: string, b: string): string; (a: number, b: number): number; }',
    );
    expect(variableType.flags).to.deep.eq(['Object']);

    expect(variableType.callSignatures!.length).to.eql(2);

    const [callSig1, callSig2] = variableType.callSignatures!;
    expect(callSig1.typeString).to.eql('(a: string, b: string): string');
    expect(callSig1.parameters!.length).to.eql(2);
    const [sig1Param1, sig1Param2] = callSig1.parameters!.map(p => t.resolveReference(p));
    expect(sig1Param1.name).to.eq('a');
    expect(sig1Param1.typeString).to.eq('string');
    expect(sig1Param2.name).to.eq('b');
    expect(sig1Param2.typeString).to.eq('string');
    const sig1ReturnType = t.resolveReference(callSig1.returnType!);
    expect(sig1ReturnType.typeString).to.eq('string');

    expect(callSig2.typeString).to.eql('(a: number, b: number): number');
    expect(callSig2.parameters!.length).to.eql(2);
    const [sig2Param1, sig2Param2] = callSig2.parameters!.map(p => t.resolveReference(p));
    expect(sig2Param1.name).to.eq('a');
    expect(sig2Param1.typeString).to.eq('number');
    expect(sig2Param2.name).to.eq('b');
    expect(sig2Param2.typeString).to.eq('number');
    const sig2ReturnType = t.resolveReference(callSig2.returnType!);
    expect(sig2ReturnType.typeString).to.eq('number');

    t.cleanup();
  }
}
