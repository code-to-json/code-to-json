// tslint:disable no-identical-functions

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { singleExportModuleExports } from './helpers';

@suite
class CustomTypeSerialiationBoundaryTests {
  @test
  public async 'non-exported interface'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports(`interface Foo { num: number; }

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
