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
    expect(classSymbol.symbolString).to.eql('Vehicle');
    expect(classSymbol.typeString).to.eql('typeof Vehicle', 'has correct type');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classType = t.resolveReference(classSymbol.type);
    expect(classType.typeString).to.eql('typeof Vehicle');
    expect(classType.flags).to.deep.eq(['Object']);
    expect(classType.constructorSignatures!.length).to.eq(1, '1 constructor signature');

    const classPropNames = Object.keys(classType.properties!);
    expect(classPropNames).to.deep.eq([]);
    const [constructorSig] = classType.constructorSignatures!;
    expect(constructorSig.typeString).to.eq('(): Vehicle');
    const instanceType = t.resolveReference(constructorSig.returnType);
    expect(instanceType.typeString).to.eq('Vehicle');
    const instancePropNames = Object.keys(instanceType.properties!);
    expect(instancePropNames).to.deep.eq(['numWheels', 'drive']);
    const props = instancePropNames.map(p => t.resolveReference(instanceType.properties![p]));
    const [numWheelsSym, driveSym] = props;
    expect(numWheelsSym.flags).to.deep.eq(['Property']);
    expect(driveSym.flags).to.deep.eq(['Method', 'Transient']);
    expect(numWheelsSym.symbolString).to.eq('numWheels');
    expect(driveSym.symbolString).to.eq('drive');
    const [numWheelsType, driveType] = props.map(s => t.resolveReference(s.type));

    expect(numWheelsType.typeString).to.eql('number');
    expect(driveType.typeString).to.eql('() => string');
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
    expect(classSymbol.symbolString).to.eql('Vehicle');
    expect(classSymbol.typeString).to.eql('typeof Vehicle', 'has correct type');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');
    expect(classSymbol.isAbstract).to.eql(true);

    const classType = t.resolveReference(classSymbol.type);
    expect(classType.typeString).to.eql('typeof Vehicle');
    expect(classType.flags).to.deep.eq(['Object']);
    expect(classType.constructorSignatures!.length).to.eq(1, '1 constructor signature');

    const classPropNames = Object.keys(classType.properties!);
    expect(classPropNames).to.deep.eq([]);
    const [constructorSig] = classType.constructorSignatures!;
    expect(constructorSig.typeString).to.eq('(): Vehicle');
    const instanceType = t.resolveReference(constructorSig.returnType);
    expect(instanceType.typeString).to.eq('Vehicle');
    const instancePropNames = Object.keys(instanceType.properties!);
    expect(instancePropNames).to.deep.eq(['numWheels', 'drive']);
    const props = instancePropNames.map(p => t.resolveReference(instanceType.properties![p]));
    const [numWheelsSym, driveSym] = props;
    expect(numWheelsSym.flags).to.deep.eq(['Property']);
    expect(driveSym.flags).to.deep.eq(['Method']);
    expect(numWheelsSym.symbolString).to.eq('numWheels');
    expect(driveSym.symbolString).to.eq('drive');
    expect(driveSym.isAbstract).to.eq(true);
    const [numWheelsType, driveType] = props.map(s => t.resolveReference(s.type));

    expect(numWheelsType.typeString).to.eql('number');
    expect(driveType.typeString).to.eql('() => string');
    expect(numWheelsType.flags).to.deep.eq(['Number']);
    expect(driveType.flags).to.deep.eq(['Object']);
    expect(driveType.objectFlags).to.includes('Anonymous');
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
    expect(classSymbol.symbolString).to.eql('Vehicle');
    expect(classSymbol.typeString).to.eql('typeof Vehicle', 'has correct type');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classType = t.resolveReference(classSymbol.type);
    expect(classType.typeString).to.eql('typeof Vehicle');
    expect(classType.flags).to.deep.eq(['Object']);
    expect(classType.constructorSignatures!.length).to.eq(1, '1 constructor signature');

    const classPropNames = Object.keys(classType.properties!);
    expect(classPropNames).to.deep.eq([]);
    const [constructorSig] = classType.constructorSignatures!;
    expect(constructorSig.typeString).to.eq('(): Vehicle');

    t.cleanup();
  }

  @test
  public async 'inheriting a constructor from a base class'(): Promise<void> {
    const code = `class Vehicle {
  constructor(n: number) { setTimeout(() => console.log('hello'), n)}
}
    
export class Car extends Vehicle {}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol);
    const classSymbol = t.resolveReference(fileSymbol.exports!.Car);
    expect(classSymbol.symbolString).to.eql('Car');
    expect(classSymbol.typeString).to.eql('typeof Car', 'has correct type');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classType = t.resolveReference(classSymbol.type);
    expect(classType.typeString).to.eql('typeof Car');
    expect(classType.flags).to.deep.eq(['Object']);
    expect(classType.constructorSignatures!.length).to.eq(1, '1 constructor signature');

    const classPropNames = Object.keys(classType.properties!);
    expect(classPropNames).to.deep.eq([]);
    const [constructorSig] = classType.constructorSignatures!;
    expect(constructorSig.typeString).to.eq('(n: number): Car');

    t.cleanup();
  }

  @test
  public async 'inheriting multiple constructor signatures from a base class'(): Promise<void> {
    const code = `class Vehicle {
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
    expect(classSymbol.symbolString).to.eql('Car');
    expect(classSymbol.typeString).to.eql('typeof Car', 'has correct type');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classType = t.resolveReference(classSymbol.type);
    expect(classType.typeString).to.eql('typeof Car');
    expect(classType.flags).to.deep.eq(['Object']);
    expect(classType.constructorSignatures!.length).to.eq(2, '2 constructor signatures');

    const classPropNames = Object.keys(classType.properties!);
    expect(classPropNames).to.deep.eq([]);
    const [constructorSig1, constructorSig2] = classType.constructorSignatures!;
    expect(constructorSig1.typeString).to.eq('(n: number): Car');
    expect(constructorSig2.typeString).to.eq('(n: number, coeff: number): Car');

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
    expect(classSymbol.symbolString).to.eql('SimpleClass');
    expect(classSymbol.typeString).to.eql('typeof SimpleClass', 'has correct type');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classType = t.resolveReference(classSymbol.type);
    expect(classType.typeString).to.eql('typeof SimpleClass');
    expect(classType.flags).to.deep.eq(['Object']);
    expect(classType.constructorSignatures!.length).to.eq(1, '1 constructor signature');

    const classPropNames = Object.keys(classType.properties!);
    expect(classPropNames).to.deep.eq(['hello', 'planet']);
    const [helloSym, planetSym] = classPropNames.map(n =>
      t.resolveReference(classType.properties![n]),
    );
    expect(helloSym.symbolString).to.eq('hello');
    expect(helloSym.modifiers).to.deep.eq(['static']);
    expect(helloSym.flags).to.deep.eq(['Method']);
    expect(planetSym.symbolString).to.eq('planet');
    expect(planetSym.modifiers).to.deep.eq(['static']);
    expect(planetSym.flags).to.deep.eq(['Property']);

    const [constructorSig] = classType.constructorSignatures!;
    expect(constructorSig.typeString).to.eq('(bar: string): SimpleClass');
    const instanceType = t.resolveReference(constructorSig.returnType);
    expect(instanceType.typeString).to.eq('SimpleClass');
    const instancePropNames = Object.keys(instanceType.properties!);
    expect(instancePropNames).to.deep.eq(['foo']);
    const props = instancePropNames.map(p => t.resolveReference(instanceType.properties![p]));
    const [fooSym] = props;
    expect(fooSym.flags).to.deep.eq(['Property']);
    expect(fooSym.symbolString).to.eq('foo');
    const [fooType] = props.map(s => t.resolveReference(s.type));

    expect(fooType.typeString).to.eql('string');
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
    expect(classSymbol.symbolString).to.eql('SimpleClass');
    expect(classSymbol.typeString).to.eql('typeof SimpleClass', 'has correct type');
    expect(classSymbol.flags).to.eql(['Class'], 'Regarded as a class');
    expect(classSymbol.modifiers).to.include('export');

    const classType = t.resolveReference(classSymbol.type);
    expect(classType.typeString).to.eql('typeof SimpleClass');
    expect(classType.flags).to.deep.eq(['Object']);
    expect(classType.constructorSignatures!.length).to.eq(1, '1 constructor signature');

    const classPropNames = Object.keys(classType.properties!);
    expect(classPropNames).to.deep.eq(['hello']);
    const [helloSym] = classPropNames.map(n => t.resolveReference(classType.properties![n]));
    expect(helloSym.symbolString).to.eq('hello');
    expect(helloSym.modifiers).to.include('protected', 'static');
    expect(helloSym.flags).to.deep.eq(['Method']);

    const [constructorSig] = classType.constructorSignatures!;
    expect(constructorSig.typeString).to.eq('(bar: string): SimpleClass');
    expect(constructorSig.modifiers).to.deep.eq(['private']);
    const instanceType = t.resolveReference(constructorSig.returnType);
    expect(instanceType.typeString).to.eq('SimpleClass');
    const instancePropNames = Object.keys(instanceType.properties!);
    expect(instancePropNames).to.deep.eq(['foo', 'myBar', 'myBaz']);
    const props = instancePropNames.map(p => t.resolveReference(instanceType.properties![p]));
    const [fooSym, myBarSym, myBazSym] = props;
    expect(fooSym.flags).to.deep.eq(['Property']);
    expect(fooSym.symbolString).to.eq('foo');
    const [fooType] = props.map(s => t.resolveReference(s.type));

    expect(fooType.typeString).to.eql('string');
    expect(fooType.flags).to.deep.eq(['String']);

    expect(myBarSym.modifiers).to.deep.eq(['public']);
    expect(myBazSym.modifiers).to.deep.eq(['private']);
    t.cleanup();
  }
}
