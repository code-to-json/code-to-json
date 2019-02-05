import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { camelize } from '../src/string';

@suite
export class StringUtilTests {
  @test public 'camelize tests'(): void {
    expect(camelize('')).to.eq('');
    expect(camelize('FooBar')).to.eq('fooBar');
    expect(camelize('Foo')).to.eq('foo');
    expect(camelize('Foo_bar')).to.eq('fooBar');
    expect(camelize('foo_bar')).to.eq('fooBar');
    expect(camelize('foo-bar')).to.eq('fooBar');
  }
}
