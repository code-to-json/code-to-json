import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class ClassSerializationTests {
  @test
  public async 'class Vehicle { numWheels: number = 4; drive() { return "vroom";} }'(): Promise<
    void
  > {
    const code = 'export class Vehicle { numWheels: number = 4; drive() { return "vroom";} }';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const classSymbol = t.resolveReference(fileSymbol.exports!.Vehicle);
    expect(classSymbol.text).to.eql('Vehicle');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classSymbolType = t.resolveReference(classSymbol.symbolType);
    expect(classSymbolType.text).to.eql('Vehicle');
    expect(classSymbolType.flags).to.deep.eq(['Object']);
    expect(!!classSymbolType.constructorSignatures).to.eq(false, 'no constructor signatures');

    const classValueDeclarationType = t.resolveReference(classSymbol.valueDeclarationType);
    expect(classValueDeclarationType.text).to.eql('typeof Vehicle');
    expect(classValueDeclarationType.flags).to.deep.eq(['Object']);
    expect(classValueDeclarationType.constructorSignatures!.length).to.eq(
      1,
      '1 constructor signature',
    );

    const classPropNames = Object.keys(classSymbolType.properties!);
    expect(classPropNames).to.deep.eq(['numWheels', 'drive']);
    const [constructorSig] = classValueDeclarationType.constructorSignatures!;
    expect(constructorSig.text).to.eq('(): Vehicle');
    const instanceType = t.resolveReference(constructorSig.returnType);
    expect(instanceType.text).to.eq('Vehicle');
    const instancePropNames = Object.keys(instanceType.properties!);
    expect(instancePropNames).to.deep.eq(['numWheels', 'drive']);
    const props = instancePropNames.map((p) => t.resolveReference(instanceType.properties![p]));
    const [numWheelsSym, driveSym] = props;
    expect(numWheelsSym.flags).to.deep.eq(['Property']);
    expect(driveSym.flags).to.deep.eq(['Method', 'Transient']);
    expect(numWheelsSym.text).to.eq('numWheels');
    expect(driveSym.text).to.eq('drive');

    const [numWheelsType, driveType] = props.map((s) => t.resolveReference(s.valueDeclarationType));
    expect(numWheelsType.text).to.eql('number');
    expect(driveType.text).to.eql('() => string');
    expect(numWheelsType.flags).to.deep.eq(['Number']);
    expect(driveType.flags).to.deep.eq(['Object']);
    expect(driveType.objectFlags).to.includes('Anonymous');

    t.cleanup();
  }

  @test
  public async 'abstract class Vehicle { numWheels: number = 4; abstract drive(): string; }'(): Promise<
    void
  > {
    const code =
      'export abstract class Vehicle { numWheels: number = 4; abstract drive(): string; }';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const classSymbol = t.resolveReference(fileSymbol.exports!.Vehicle);
    expect(classSymbol.text).to.eql('Vehicle');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');
    expect(classSymbol.isAbstract).to.eql(true);

    const classSymbolType = t.resolveReference(classSymbol.symbolType);
    expect(classSymbolType.text).to.eql('Vehicle');
    expect(classSymbolType.flags).to.deep.eq(['Object']);
    expect(!!classSymbolType.constructorSignatures).to.eq(false, 'no constructor signatures');

    const classValueDeclarationType = t.resolveReference(classSymbol.valueDeclarationType);
    expect(classValueDeclarationType.text).to.eql('typeof Vehicle');
    expect(classValueDeclarationType.flags).to.deep.eq(['Object']);
    expect(classValueDeclarationType.constructorSignatures!.length).to.eq(
      1,
      '1 constructor signature',
    );

    const instancePropNames = Object.keys(classSymbolType.properties!);
    expect(instancePropNames).to.deep.eq(['numWheels', 'drive']);
    const props = instancePropNames.map((p) => t.resolveReference(classSymbolType.properties![p]));
    const [numWheelsSym, driveSym] = props;
    expect(numWheelsSym.flags).to.deep.eq(['Property']);
    expect(driveSym.flags).to.deep.eq(['Method']);
    expect(numWheelsSym.text).to.eq('numWheels');
    expect(driveSym.text).to.eq('drive');
    expect(driveSym.isAbstract).to.eq(true);

    t.cleanup();
  }

  @test
  public async 'class that inherits from nothing with implied constructor'(): Promise<void> {
    const code = 'export class Vehicle { }';
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const classSymbol = t.resolveReference(fileSymbol.exports!.Vehicle);
    expect(classSymbol.text).to.eql('Vehicle');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classSymbolType = t.resolveReference(classSymbol.symbolType);
    expect(classSymbolType.text).to.eql('Vehicle');
    expect(classSymbolType.flags).to.deep.eq(['Object']);
    expect(!!classSymbolType.constructorSignatures).to.eq(false, 'no constructor signatures');

    const classValueDeclarationType = t.resolveReference(classSymbol.valueDeclarationType);
    expect(classValueDeclarationType.text).to.eql('typeof Vehicle');
    expect(classValueDeclarationType.flags).to.deep.eq(['Object']);
    expect(classValueDeclarationType.constructorSignatures!.length).to.eq(
      1,
      '1 constructor signature',
    );
    const classPropNames = Object.keys(classValueDeclarationType.properties!);
    expect(classPropNames).to.deep.eq([]);
    const [constructorSig] = classValueDeclarationType.constructorSignatures!;
    expect(constructorSig.text).to.eq('(): Vehicle');

    t.cleanup();
  }

  @test public async 'access modifier keyword on class method'(): Promise<void> {
    const code = `export class Foo {
      protected bar() {}
    }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    expect(Object.keys(fileExports)).to.deep.eq(['Foo']);
    const classSymbol = fileExports.Foo!;

    const instanceType = t.resolveReference(classSymbol.symbolType);
    const instanceMembers = mapDict(instanceType.properties!, (p) => t.resolveReference(p));
    const { bar } = instanceMembers;
    expect(bar!.modifiers).to.deep.include('protected');

    t.cleanup();
  }

  @test public async 'access modifier keyword via comment'(): Promise<void> {
    const code = `export class Foo {
      /**
       * @protected
       */
      bar() {}
    }`;
    const t = new SingleFileAcceptanceTestCase(code, 'js');
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    expect(Object.keys(fileExports)).to.deep.eq(['Foo']);
    const classSymbol = fileExports.Foo!;

    const instanceType = t.resolveReference(classSymbol.symbolType);
    const instanceMembers = mapDict(instanceType.properties!, (p) => t.resolveReference(p));
    const { bar } = instanceMembers;
    expect(bar!.modifiers).to.deep.include('protected');

    t.cleanup();
  }

  @test
  public async 'inheriting a constructor from a base class'(): Promise<void> {
    const code = `class Vehicle {
  public readonly abc = 'def'
  constructor(n: number) { setTimeout(() => console.log('hello'), n)}
}

export class Car extends Vehicle {}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const classSymbol = t.resolveReference(fileSymbol.exports!.Car);
    expect(classSymbol.text).to.eql('Car');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classSymbolType = t.resolveReference(classSymbol.symbolType);
    expect(classSymbolType.text).to.eql('Car');
    expect(classSymbolType.flags).to.deep.eq(['Object']);
    expect(!!classSymbolType.constructorSignatures).to.eq(false, 'no constructor signatures');

    const classValueDeclarationType = t.resolveReference(classSymbol.valueDeclarationType);
    expect(classValueDeclarationType.text).to.eql('typeof Car');
    expect(classValueDeclarationType.flags).to.deep.eq(['Object']);
    expect(classValueDeclarationType.constructorSignatures!.length).to.eq(
      1,
      '1 constructor signature',
    );

    const instancePropNames = Object.keys(classSymbolType.properties!);
    expect(instancePropNames).to.deep.eq(['abc']);

    const staticPropNames = Object.keys(classValueDeclarationType.properties!);
    expect(staticPropNames).to.deep.eq([]);
    const [constructorSig] = classValueDeclarationType.constructorSignatures!;
    expect(constructorSig.text).to.eq('(n: number): Car');

    t.cleanup();
  }

  @test
  public async 'heritage clause serialization'(): Promise<void> {
    const code = `export interface HasVinNumber {
  vin: number;
}

export class Vehicle {
  public readonly abc = 'def'
  constructor(n: number) { setTimeout(() => console.log('hello'), n)}
}

export class Car extends Vehicle implements HasVinNumber {
  constructor() {
    super();
    this.vin = 4;
  }
}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const classSymbol = t.resolveReference(fileSymbol.exports!.Car);

    const classSymbolType = t.resolveReference(classSymbol.symbolType);
    const baseTypes = classSymbolType.baseTypes!.map((bc) => t.resolveReference(bc));
    expect(baseTypes.map((bt) => bt.text).join(', ')).to.eq('Vehicle');

    const { heritageClauses } = classSymbol;
    expect(heritageClauses!.length).to.eq(2);
    expect(heritageClauses![0].kind).to.eq('extends');
    expect(heritageClauses![0].types.map((typ) => t.resolveReference(typ).text).join(', ')).to.eq('Vehicle');
    expect(heritageClauses![1].kind).to.eq('implements');
    expect(heritageClauses![1].types.map((typ) => t.resolveReference(typ).text).join(', ')).to.eq('HasVinNumber');

    t.cleanup();
  }

  @test
  public async 'inheriting multiple constructor signatures from a base class'(): Promise<void> {
    const code = `class Vehicle {
  public readonly abc = 'def'

  constructor(n: number);
  constructor(n: number, coeff: number);
  constructor(n: number, coeff: number = 1) { setTimeout(() => console.log('hello'), n * coeff)}
}

export class Car extends Vehicle {}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const classSymbol = t.resolveReference(fileSymbol.exports!.Car);
    expect(classSymbol.text).to.eql('Car');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classSymbolType = t.resolveReference(classSymbol.symbolType);
    expect(classSymbolType.text).to.eql('Car');
    expect(classSymbolType.flags).to.deep.eq(['Object']);
    expect(!!classSymbolType.constructorSignatures).to.eq(false, 'no constructor signatures');

    const classValueDeclarationType = t.resolveReference(classSymbol.valueDeclarationType);
    expect(classValueDeclarationType.text).to.eql('typeof Car');
    expect(classValueDeclarationType.flags).to.deep.eq(['Object']);
    expect(classValueDeclarationType.constructorSignatures!.length).to.eq(
      2,
      '2 constructor signatures',
    );

    const instancePropNames = Object.keys(classSymbolType.properties!);
    expect(instancePropNames).to.deep.eq(['abc']);

    const classPropNames = Object.keys(classValueDeclarationType.properties!);
    expect(classPropNames).to.deep.eq([]);
    const [constructorSig1, constructorSig2] = classValueDeclarationType.constructorSignatures!;
    expect(constructorSig1.text).to.eq('(n: number): Car');
    expect(constructorSig2.text).to.eq('(n: number, coeff: number): Car');

    t.cleanup();
  }

  @test
  public async 'class with properties, methods and static functions'(): Promise<void> {
    const code = `export class SimpleClass {
  constructor(bar: string) { console.log(bar); }
  public foo: string = 'bar';
  static hello(): string { return this.planet; }
  static planet = "world";
}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const classSymbol = t.resolveReference(fileSymbol.exports!.SimpleClass);
    expect(classSymbol.text).to.eql('SimpleClass');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classSymbolType = t.resolveReference(classSymbol.symbolType);
    expect(classSymbolType.text).to.eql('SimpleClass');
    expect(classSymbolType.flags).to.deep.eq(['Object']);
    expect(!!classSymbolType.constructorSignatures).to.eq(false, 'no constructor signatures');

    const classValueDeclarationType = t.resolveReference(classSymbol.valueDeclarationType);
    expect(classValueDeclarationType.text).to.eql('typeof SimpleClass');
    expect(classValueDeclarationType.flags).to.deep.eq(['Object']);
    expect(classValueDeclarationType.constructorSignatures!.length).to.eq(
      1,
      '1 constructor signature',
    );

    const classPropNames = Object.keys(classValueDeclarationType.properties!);
    expect(classPropNames).to.deep.eq(['hello', 'planet']);
    const [helloSym, planetSym] = classPropNames.map((n) =>
      t.resolveReference(classValueDeclarationType.properties![n]),
    );
    expect(helloSym.text).to.eq('hello');
    expect(helloSym.modifiers).to.deep.eq(['static']);
    expect(helloSym.flags).to.deep.eq(['Method']);
    expect(planetSym.text).to.eq('planet');
    expect(planetSym.modifiers).to.deep.eq(['static']);
    expect(planetSym.flags).to.deep.eq(['Property']);

    const [constructorSig] = classValueDeclarationType.constructorSignatures!;
    expect(constructorSig.text).to.eq('(bar: string): SimpleClass');
    const instanceType = t.resolveReference(constructorSig.returnType);
    expect(instanceType.text).to.eq('SimpleClass');
    const instancePropNames = Object.keys(instanceType.properties!);
    expect(instancePropNames).to.deep.eq(['foo']);
    const props = instancePropNames.map((p) => t.resolveReference(instanceType.properties![p]));
    const [fooSym] = props;
    expect(fooSym.flags).to.deep.eq(['Property']);
    expect(fooSym.text).to.eq('foo');
    const [fooType] = props.map((s) => t.resolveReference(s.valueDeclarationType));

    expect(fooType.text).to.eql('string');
    expect(fooType.flags).to.deep.eq(['String']);

    t.cleanup();
  }

  @test
  public async 'class with properties, methods and static functions using a variety of access modifier keywords'(): Promise<
    void
  > {
    const code = `export abstract class SimpleClass {

  protected static hello(): string { return 'world'; }

  protected readonly foo: string = 'bar';
  public myBar: string = 'bar';
  private myBaz: string[] = ['baz'];

  private constructor(bar: string) { console.log(bar); }
}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const classSymbol = t.resolveReference(fileSymbol.exports!.SimpleClass);
    expect(classSymbol.text).to.eql('SimpleClass');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classSymbolType = t.resolveReference(classSymbol.symbolType);
    expect(classSymbolType.text).to.eql('SimpleClass');
    expect(classSymbolType.flags).to.deep.eq(['Object']);
    expect(!!classSymbolType.constructorSignatures).to.eq(false, 'no constructor signatures');

    const classValueDeclarationType = t.resolveReference(classSymbol.valueDeclarationType);
    expect(classValueDeclarationType.text).to.eql('typeof SimpleClass');
    expect(classValueDeclarationType.flags).to.deep.eq(['Object']);
    expect(classValueDeclarationType.constructorSignatures!.length).to.eq(
      1,
      '1 constructor signature',
    );

    const classPropNames = Object.keys(classValueDeclarationType.properties!);
    expect(classPropNames).to.deep.eq(['hello']);
    const [helloSym] = classPropNames.map((n) =>
      t.resolveReference(classValueDeclarationType.properties![n]),
    );
    expect(helloSym.text).to.eq('hello');
    expect(helloSym.modifiers).to.include('protected', 'static');
    expect(helloSym.flags).to.deep.eq(['Method']);

    const [constructorSig] = classValueDeclarationType.constructorSignatures!;
    expect(constructorSig.text).to.eq('(bar: string): SimpleClass');
    expect(constructorSig.modifiers).to.deep.eq(['private']);
    const instanceType = t.resolveReference(constructorSig.returnType);
    expect(instanceType.text).to.eq('SimpleClass');
    const instancePropNames = Object.keys(instanceType.properties!);
    expect(instancePropNames).to.deep.eq(['foo', 'myBar', 'myBaz']);
    const props = instancePropNames.map((p) => t.resolveReference(instanceType.properties![p]));
    const [fooSym, myBarSym, myBazSym] = props;
    expect(fooSym.flags).to.deep.eq(['Property']);
    expect(fooSym.text).to.eq('foo');
    const [fooType] = props.map((s) => t.resolveReference(s.valueDeclarationType));

    expect(fooType.text).to.eql('string');
    expect(fooType.flags).to.deep.eq(['String']);

    expect(myBarSym.modifiers).to.deep.eq(['public']);
    expect(myBazSym.modifiers).to.deep.eq(['private']);
    t.cleanup();
  }
}
