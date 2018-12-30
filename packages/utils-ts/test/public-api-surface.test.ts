import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import * as Exported from '../src/index';

const {
  isDeclaration,
  isDeclarationExported,
  isNamedDeclaration,
  isNode,
  isSymbol,
  isType,
  mapChildren,
  mapUem,
  transpileTsString,
} = Exported;

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
    expect(isSymbol).to.be.a('function');
    expect(isType).to.be.a('function');
    expect(mapChildren).to.be.a('function');
    expect(mapUem).to.be.a('function');
  }

  @test
  public 'no extra exports'(): void {
    expect(Object.keys(Exported).sort()).to.eql([
      'isDeclaration',
      'isDeclarationExported',
      'isNamedDeclaration',
      'isNode',
      'isSymbol',
      'isType',
      'mapChildren',
      'mapUem',
      'transpileTsString',
    ]);
  }
}
