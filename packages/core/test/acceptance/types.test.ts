// tslint:disable no-identical-functions

import { expect } from 'chai';
import { slow, suite, test, timeout } from 'mocha-typescript';
import { exportedModuleSymbols } from './helpers';

@suite
@slow(800)
@timeout(1200)
export class TypeSerializationTests {
  @test
  public async 'type queries'(): Promise<void> {
    const { exports: allExports, cleanup } = await exportedModuleSymbols(
      `let rectangle1 = { width: 100, height: 200 };
export let x: typeof rectangle1;`,
    );
    const { x } = allExports;
    expect(!!x).to.eql(true);
    expect(x.name).to.eql('x');
    expect(x.type).to.be.a('object');
    expect(x.type!.typeString).to.eql('{ width: number; height: number; }');
    expect(x.type!.flags).includes('Object');

    cleanup();
  }

  @test
  public async 'non-exported interface'(): Promise<void> {
    const { exports, cleanup } = await exportedModuleSymbols(`interface Foo { num: number; }

export const x: Foo = { num: 4 };`);
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Object'],
          objectFlags: ['Interface'],
          typeString: 'Foo',
        },
      },
    });
    cleanup();
  }
}
