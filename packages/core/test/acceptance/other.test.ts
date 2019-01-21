// tslint:disable no-identical-functions

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { exportedModuleSymbols } from './helpers';

@suite
export class OtherAcceptanceTests {
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
}
