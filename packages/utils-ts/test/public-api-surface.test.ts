import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import {
  isDeclaration,
  isDeclarationExported,
  isNamedDeclaration,
  isNode,
  isSymbol,
  isType,
  transpileTsString,
} from '../src/index';

@suite
class PublicApiSurface {
  @test
  public 'public API surface is as expected'(): void {
    expect(isDeclaration).to.be.a('function');
    expect(isDeclarationExported).to.be.a('function');
    expect(isNamedDeclaration).to.be.a('function');
    expect(transpileTsString).to.be.a('function');
    expect(isNode).to.be.a('function');
    expect(isSymbol).to.be.a('function');
    expect(isType).to.be.a('function');
  }
}
