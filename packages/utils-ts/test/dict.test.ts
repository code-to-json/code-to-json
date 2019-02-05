import { Dict } from '@mike-north/types';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { filterDict, forEachDict, mapDict, reduceDict } from '../src/dict';

@suite
export class DictUtilTests {
  @test public async 'forEachDict - Dict<T>'(): Promise<void> {
    const vals: string[] = [];
    forEachDict({ foo: 'bar', biz: 'baz' } as Dict<string>, (s) => vals.push(s.toUpperCase()));
    expect(vals).to.deep.eq(['BAR', 'BAZ']);
  }

  @test public async 'mapDict - Dict<T>'(): Promise<void> {
    expect(mapDict({ foo: 'bar', biz: 'baz' } as Dict<string>, (s) => s.toUpperCase())).to.deep.eq({
      foo: 'BAR',
      biz: 'BAZ',
    });
  }

  @test public async 'reduceDict - Dict<T>'(): Promise<void> {
    expect(reduceDict({ foo: 'bar', biz: 'baz' } as Dict<string>, (x, s) => x + s, '')).to.eq(
      'barbaz',
    );
  }

  @test public async 'filterDict - Dict<T>'(): Promise<void> {
    expect(
      filterDict({ foo: 'bar', biz: 'baz' } as Dict<string>, (s) => s[s.length - 1] === 'z'),
    ).to.deep.eq({
      biz: 'baz',
    });
  }
}
