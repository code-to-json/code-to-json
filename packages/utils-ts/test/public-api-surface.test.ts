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
  createProgramFromCodeString,
  createProgramFromTsConfig,
  createProgramFromEntries,
  generateHash,
  generateId,
  generateModulePathNormalizer,
  PASSTHROUGH_MODULE_PATH_NORMALIZER,
} = Exported;

@suite
class PublicApiSurface {
  @test
  public 'public API surface is as expected'(): void {
    expect(isDeclaration).to.be.a('function', 'isDeclaration is a function');
    expect(isDeclarationExported).to.be.a('function', 'isDeclarationExported is a function');
    expect(isNamedDeclaration).to.be.a('function', 'isNamedDeclaration is a function');
    expect(createProgramFromTsConfig).to.be.a(
      'function',
      'createProgramFromTsConfig is a function',
    );
    expect(createProgramFromEntries).to.be.a('function', 'createProgramFromEntries is a function');
    expect(createProgramFromCodeString).to.be.a(
      'function',
      'createProgramFromCodeString is a function',
    );
    expect(isNode).to.be.a('function', 'isNode is a function');
    expect(isSymbol).to.be.a('function', 'isSymbol is a function');
    expect(isType).to.be.a('function', 'isType is a function');
    expect(isSymbol).to.be.a('function', 'isSymbol is a function');
    expect(isType).to.be.a('function', 'isType is a function');
    expect(mapChildren).to.be.a('function', 'mapChildren is a function');
    expect(generateHash).to.be.a('function', 'generateHash is a function');
    expect(generateId).to.be.a('function', 'generateId is a function');
    expect(generateModulePathNormalizer).to.be.a(
      'function',
      'generateModulePathNormalizer is a function',
    );
    expect(mapUem).to.be.a('function', 'mapUem is a function');
    expect(PASSTHROUGH_MODULE_PATH_NORMALIZER).to.be.a(
      'object',
      'PASSTHROUGH_MODULE_PATH_NORMALIZER is a object',
    );
  }

  @test
  public 'no extra exports'(): void {
    expect(Object.keys(Exported).sort()).to.eql([
      'PASSTHROUGH_MODULE_PATH_NORMALIZER',
      'createProgramFromCodeString',
      'createProgramFromEntries',
      'createProgramFromTsConfig',
      'generateHash',
      'generateId',
      'generateModulePathNormalizer',
      'isDeclaration',
      'isDeclarationExported',
      'isNamedDeclaration',
      'isNode',
      'isSymbol',
      'isType',
      'mapChildren',
      'mapUem',
    ]);
  }
}
