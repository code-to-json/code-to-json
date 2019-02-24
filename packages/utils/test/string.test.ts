import { expect } from 'chai';
import { describe, it } from 'mocha';
import { camelize } from '../src/string';

describe('String utilities tests', () => {
  it('camelize tests', () => {
    expect(camelize('')).to.eq('');
    expect(camelize('FooBar')).to.eq('fooBar');
    expect(camelize('Foo')).to.eq('foo');
    expect(camelize('Foo_bar')).to.eq('fooBar');
    expect(camelize('foo_bar')).to.eq('fooBar');
    expect(camelize('foo-bar')).to.eq('fooBar');
  });
});
