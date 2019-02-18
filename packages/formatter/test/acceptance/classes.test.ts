import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class ClassFormatterAcceptanceTests {
  @test public async 'simple class'(): Promise<void> {
    const code = `export class Foo{}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    expect(Object.keys(fileExports)).to.deep.eq(['Foo']);
    const classSymbol = fileExports.Foo!;
    expect(classSymbol.name).to.eq('Foo');
    expect(classSymbol.text).to.eq('Foo');
    expect(classSymbol.flags).to.deep.eq(['class']);

    const classType = t.resolveReference(classSymbol.valueType);
    expect(classType.text).to.eq('typeof Foo');

    expect(classType.flags).to.deep.eq(['object']);
    expect(classType.objectFlags).to.deep.eq(['anonymous']);
    expect(classType.constructorSignatures!.length).to.eq(1);
    const instanceType = t.resolveReference(classSymbol.type);
    expect(instanceType.text).to.eql('Foo');
    t.cleanup();
  }

  @test public async 'simple class (default export)'(): Promise<void> {
    const code = `export default class Foo{}`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    expect(Object.keys(fileExports)).to.deep.eq(['default']);
    const classSymbol = fileExports.default!;
    expect(classSymbol.name).to.eq('default');
    expect(classSymbol.text).to.eq('Foo');
    expect(classSymbol.flags).to.deep.eq(['class']);

    const classType = t.resolveReference(classSymbol.valueType);
    expect(classType.text).to.eq('typeof Foo');

    expect(classType.flags).to.deep.eq(['object']);
    expect(classType.objectFlags).to.deep.eq(['anonymous']);
    expect(classType.constructorSignatures!.length).to.eq(1);
    expect(t.resolveReference(classSymbol.type).text).to.eql('Foo');
    t.cleanup();
  }

  @test public async 'class with methods'(): Promise<void> {
    const code = `export class Foo {
      bar() { return '--bar--'; }
      baz() { return '--baz--'; }
    }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    expect(Object.keys(fileExports)).to.deep.eq(['Foo']);
    const classSymbol = fileExports.Foo!;
    expect(classSymbol.name).to.eq('Foo');
    expect(classSymbol.text).to.eq('Foo');
    expect(classSymbol.flags).to.deep.include('class');

    const classType = t.resolveReference(classSymbol.valueType);
    expect(classType.text).to.eq('typeof Foo');
    expect(classType.properties).to.eq(undefined);

    expect(classType.flags).to.deep.eq(['object']);
    expect(classType.objectFlags).to.deep.eq(['anonymous']);
    expect(classType.constructorSignatures!.length).to.eq(1);
    const instanceType = t.resolveReference(classSymbol.type);
    expect(instanceType.text).to.eql('Foo');
    const instanceMembers = mapDict(instanceType.properties!, (p) => t.resolveReference(p));
    expect(Object.keys(instanceMembers)).to.deep.eq(['bar', 'baz']);
    const { bar, baz } = instanceMembers;
    expect(bar!.flags).to.deep.eq(['method', 'transient']);
    expect(baz!.flags).to.deep.eq(['method', 'transient']);
    expect(bar!.text).to.eq('bar');
    expect(baz!.text).to.eq('baz');
    t.cleanup();
  }

  @test public async 'class with methods and properties'(): Promise<void> {
    const code = `export class Foo {
      biz: string = '--biz--';
      bar() { return '--bar--'; }
      baz() { return '--baz--'; }
    }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const classSymbol = fileExports.Foo!;
    const instanceType = t.resolveReference(classSymbol.type);
    const instanceMembers = mapDict(instanceType.properties!, (p) => t.resolveReference(p));
    expect(Object.keys(instanceMembers)).to.deep.eq(['biz', 'bar', 'baz']);
    const { biz, bar, baz } = instanceMembers;
    expect(bar!.flags).to.deep.eq(['method', 'transient']);
    expect(baz!.flags).to.deep.eq(['method', 'transient']);
    expect(biz!.flags).to.deep.eq(['property']);
    expect(bar!.text).to.eq('bar');
    expect(baz!.text).to.eq('baz');
    expect(biz!.text).to.eq('biz');
    t.cleanup();
  }

  @test public async 'class with methods, properties and access modifiers'(): Promise<void> {
    const code = `export class Foo {
      protected biz: string = '--biz--';
      public baa: string = '--baa--';
      private bee: string = '--bee--';
      protected bar() { return '--bar--'; }
      public baz() { return '--baz--'; }
    }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const classSymbol = fileExports.Foo!;
    const instanceType = t.resolveReference(classSymbol.type);
    const instanceMembers = mapDict(instanceType.properties!, (p) => t.resolveReference(p));
    expect(Object.keys(instanceMembers)).to.deep.eq(['biz', 'baa', 'bee', 'bar', 'baz']);
    const { biz, bar, baz, bee, baa } = instanceMembers;
    expect(biz!.accessModifier).to.eq('protected');
    expect(bar!.accessModifier).to.eq('protected');
    expect(baz!.accessModifier).to.eq('public');
    expect(bee!.accessModifier).to.eq('private');
    expect(baa!.accessModifier).to.eq('public');
    t.cleanup();
  }

  @test public async 'class with static functions'(): Promise<void> {
    const code = `export class Foo {
      public static baz(): undefined { return undefined; }
      public static biz(): unknown { return unknown; }
      protected static bar(): null { return null; }
      private static bee: string = '--bee--';
    }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const classSymbol = fileExports.Foo!;
    const classType = t.resolveReference(classSymbol.valueType);
    const staticMembers = mapDict(classType.properties!, (p) => t.resolveReference(p));
    expect(Object.keys(staticMembers)).to.deep.eq(['baz', 'biz', 'bar', 'bee']);
    const instanceType = t.resolveReference(classSymbol.type);
    expect(instanceType.properties).to.eq(undefined);

    t.cleanup();
  }

  @test public async 'abstract class'(): Promise<void> {
    const code = `export abstract class Foo {
      protected abstract abstractBar(): string;
    }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const classSymbol = fileExports.Foo!;
    expect(classSymbol.isAbstract).to.eq(true);
    const classType = t.resolveReference(classSymbol.valueType);
    expect(classType.properties).to.eq(undefined);
    const instanceType = t.resolveReference(classSymbol.type);

    const instanceMembers = mapDict(instanceType.properties!, (p) => t.resolveReference(p));
    expect(Object.keys(instanceMembers)).to.deep.eq(['abstractBar']);
    const { abstractBar } = instanceMembers;
    expect(abstractBar!.isAbstract).to.eq(true);

    t.cleanup();
  }

  @test public async 'class w/ class decorator'(): Promise<void> {
    const code = `
    function baz<O>(target: new () => O) {
      Object.defineProperty(target, 'bar', {
        value: 123,
      });
    }
    @baz
    export class Foo {
      protected biz() {
        return '';
      }
    }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const classSymbol = fileExports.Foo!;
    expect(!!classSymbol.isAbstract).to.eq(false);
    expect(classSymbol.decorators!.length).to.eq(1);

    const firstDecorator = t.resolveReference(classSymbol.decorators![0]);
    expect(firstDecorator.name).to.eql('baz');
    expect(firstDecorator.flags).to.deep.eq(['function']);
    expect(firstDecorator.text).to.eq('baz');

    const firstDecoratorType = t.resolveReference(firstDecorator.valueType);
    expect(firstDecoratorType.text).to.eq('<O>(target: new () => O) => void');
    expect(firstDecoratorType.flags).to.deep.eq(['object']);
    expect(firstDecoratorType.objectFlags).to.deep.eq(['anonymous']);

    t.cleanup();
  }

  @test public async 'class w/ multiple class decorators'(): Promise<void> {
    const code = `
    function baz<O>(target: new () => O) {
      Object.defineProperty(target, 'bazzz', {
        value: 123,
      });
    }
    function bar<O>(target: new () => O) {
      Object.defineProperty(target, 'barrr', {
        value: 123,
      });
    }
    @baz
    @bar
    export class Foo {
      protected biz() {
        return '';
      }
    }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const classSymbol = fileExports.Foo!;
    expect(!!classSymbol.isAbstract).to.eq(false);
    expect(classSymbol.decorators!.length).to.eq(2);
    const [firstDecorator, secondDecorator] = classSymbol.decorators!.map((d) =>
      t.resolveReference(d),
    );
    expect(firstDecorator.name).to.eql('baz');
    expect(firstDecorator.flags).to.deep.eq(['function']);
    expect(firstDecorator.text).to.eq('baz');

    const firstDecoratorType = t.resolveReference(firstDecorator.valueType);
    expect(firstDecoratorType.text).to.eq('<O>(target: new () => O) => void');
    expect(firstDecoratorType.flags).to.deep.eq(['object']);
    expect(firstDecoratorType.objectFlags).to.deep.eq(['anonymous']);

    expect(secondDecorator.name).to.eql('bar');
    expect(secondDecorator.flags).to.deep.eq(['function']);
    expect(secondDecorator.text).to.eq('bar');

    const secondDecoratorType = t.resolveReference(secondDecorator.valueType);
    expect(secondDecoratorType.text).to.eq('<O>(target: new () => O) => void');
    expect(secondDecoratorType.flags).to.deep.eq(['object']);
    expect(secondDecoratorType.objectFlags).to.deep.eq(['anonymous']);

    t.cleanup();
  }

  @test public async 'class w/ non-exported base class'(): Promise<void> {
    const code = `abstract class Foo {
    protected abstract abstractBar(): string;
  }
  export class Baz extends Foo {
    protected abstractBar() { return 'baaarrr'; }
    public baz() { return 42; }
  }
  `;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const classSymbol = fileExports.Baz!;
    expect(!!classSymbol.isAbstract).to.eq(false);
    const classType = t.resolveReference(classSymbol.valueType);
    expect(!!classType).to.eq(true);

    const instanceType = t.resolveReference(classSymbol.type);
    expect(!!instanceType.baseTypes).to.eq(true);
    expect(instanceType.baseTypes!.length).to.eq(1);
    const [baseType] = instanceType.baseTypes!.map((bt) => t.resolveReference(bt));
    expect(baseType.text).to.eq('Foo');
    const baseTypeSymbol = t.resolveReference(baseType.symbol);
    expect(baseTypeSymbol.isAbstract).to.eq(true);

    t.cleanup();
  }

  @test.only public async 'class w/ heritage clauses'(): Promise<void> {
    const code = `class Foo {
  bar: string;
}

interface HasBiz {
  biz: number[];
}

export class Baz extends Foo implements HasBiz {
  bar = 'abc';
  biz = [32, 21];
  public baz() { return 42; }
}
  `;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, (e) => t.resolveReference(e));
    const classSymbol = fileExports.Baz!;
    expect(classSymbol.heritageClauses!.length).to.eq(2);
    expect(classSymbol.heritageClauses![0].kind).to.eq('extends');
    expect(classSymbol.heritageClauses![0].types.map((typ) => t.resolveReference(typ).text).join(', ')).to.eq('Foo');
    expect(classSymbol.heritageClauses![1].kind).to.eq('implements');
    expect(classSymbol.heritageClauses![1].types.map((typ) => t.resolveReference(typ).text).join(', ')).to.eq('HasBiz');

    t.cleanup();
  }
}
