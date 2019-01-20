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
  mapDict,
  createProgramFromCodeString,
  createProgramFromTsConfig,
  createProgramFromEntries,
  generateHash,
  generateId,
  generateModulePathNormalizer,
  forEachDict,
  flagsToString,
  getFirstIdentifier,
  filterDict,
  getObjectFlags,
  isAnonymousType,
  getTsLibFilename,
  isClassOrInterfaceType,
  isMappedType,
  isObjectReferenceType,
  isObjectType,
  isTupleType,
  nameForNode,
  reduceDict,
  relevantDeclarationForSymbol,
  relevantTypeForSymbol,
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
    expect(forEachDict).to.be.a('function', 'forEachDict is a function');
    expect(flagsToString).to.be.a('function', 'flagsToString is a function');
    expect(getFirstIdentifier).to.be.a('function', 'getFirstIdentifier is a function');
    expect(filterDict).to.be.a('function', 'filterDict is a function');
    expect(getObjectFlags).to.be.a('function', 'getObjectFlags is a function');
    expect(isAnonymousType).to.be.a('function', 'isAnonymousType is a function');
    expect(getTsLibFilename).to.be.a('function', 'getTsLibFilename is a function');
    expect(isClassOrInterfaceType).to.be.a('function', 'isClassOrInterfaceType is a function');
    expect(isObjectReferenceType).to.be.a('function', 'isObjectReferenceType is a function');
    expect(isObjectType).to.be.a('function', 'isObjectType is a function');
    expect(nameForNode).to.be.a('function', 'nameForNode is a function');
    expect(relevantDeclarationForSymbol).to.be.a(
      'function',
      'relevantDeclarationForSymbol is a function',
    );
    expect(reduceDict).to.be.a('function', 'reduceDict is a function');
    expect(relevantTypeForSymbol).to.be.a('function', 'relevantTypeForSymbol is a function');
    expect(isTupleType).to.be.a('function', 'isTupleType is a function');
    expect(isMappedType).to.be.a('function', 'isMappedType is a function');
    expect(mapChildren).to.be.a('function', 'mapChildren is a function');
    expect(generateHash).to.be.a('function', 'generateHash is a function');
    expect(generateId).to.be.a('function', 'generateId is a function');
    expect(generateModulePathNormalizer).to.be.a(
      'function',
      'generateModulePathNormalizer is a function',
    );
    expect(mapDict).to.be.a('function', 'mapUem is a function');
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
      'filterDict',
      'flagsToString',
      'forEachDict',
      'generateHash',
      'generateId',
      'generateModulePathNormalizer',
      'getFirstIdentifier',
      'getObjectFlags',
      'getTsLibFilename',
      'isAnonymousType',
      'isClassOrInterfaceType',
      'isDeclaration',
      'isDeclarationExported',
      'isMappedType',
      'isNamedDeclaration',
      'isNode',
      'isObjectReferenceType',
      'isObjectType',
      'isSymbol',
      'isTupleType',
      'isType',
      'mapChildren',
      'mapDict',
      'nameForNode',
      'reduceDict',
      'relevantDeclarationForSymbol',
      'relevantTypeForSymbol',
    ]);
  }
}
