import { Dict } from '@mike-north/types';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { filterDict, forEachDict, mapDict, reduceDict } from '../src/dict';

describe('Dict utilities tests', () => {
  it('forEachDict - Dict<T>', async () => {
    const vals: string[] = [];
    forEachDict({ foo: 'bar', biz: 'baz' } as Dict<string>, s => vals.push(s.toUpperCase()));
    expect(vals).to.deep.eq(['BAR', 'BAZ']);
  });

  it('mapDict - Dict<T>', async () => {
    expect(mapDict({ foo: 'bar', biz: 'baz' } as Dict<string>, s => s.toUpperCase())).to.deep.eq({
      foo: 'BAR',
      biz: 'BAZ',
    });
  });

  it('reduceDict - Dict<T>', async () => {
    expect(reduceDict({ foo: 'bar', biz: 'baz' } as Dict<string>, (x, s) => x + s, '')).to.eq(
      'barbaz',
    );
  });

  it('filterDict - Dict<T>', async () => {
    expect(
      filterDict({ foo: 'bar', biz: 'baz' } as Dict<string>, s => s[s.length - 1] === 'z'),
    ).to.deep.eq({
      biz: 'baz',
    });
  });
});
