// tslint:disable no-identical-functions

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { singleExportModuleExports } from './helpers';

@suite
class OtherAcceptanceTests {
  @test
  public async 'type queries'(): Promise<void> {
    const { exports, cleanup } = await singleExportModuleExports(
      `let rectangle1 = { width: 100, height: 200 };
export let x: typeof rectangle1;`,
    );
    expect(exports).to.deep.eq({
      x: {
        name: 'x',
        type: {
          flags: ['Object', 'ContainsObjectLiteral'],
          objectFlags: ['Anonymous', 'ObjectLiteral', 'FreshLiteral'],
          typeString: '{ width: number; height: number; }',
        },
      },
    });
    cleanup();
  }
}
