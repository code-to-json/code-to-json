import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as Exported from '../src/index';

const {
  isDeclaration,
  isDeclarationExported,
  isNode,
  isSymbol,
  isType,
  mapDict,
  createProgramFromCodeString,
  createProgramFromTsConfig,
  createProgramFromEntries,
  createIdGenerator,
  generateHash,
  createReverseResolver,
  forEachDict,
  flagsToString,
  getFirstIdentifier,
  filterDict,
  getObjectFlags,
  isAnonymousType,
  getTsLibName,
  isInterfaceType,
  isMappedType,
  isErroredType,
  isAbstractDeclaration,
  isConditionalType,
  isObjectReferenceType,
  isObjectType,
  isTupleType,
  reduceDict,
  isIndexType,
  getRelevantTypesForSymbol,
  isIndexedAccessType,
  isPrimitiveType,
  getNameForNode,
  modifiersToStrings,
  PASSTHROUGH_REVERSE_RESOLVER,
} = Exported;

@suite
export class PublicApiSurface {
  @test
  public 'public API surface is as expected'(): void {
    expect(isDeclaration).to.be.a('function', 'isDeclaration is a function');
    expect(isDeclarationExported).to.be.a('function', 'isDeclarationExported is a function');
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
    expect(getTsLibName).to.be.a('function', 'getTsLibName is a function');
    expect(isInterfaceType).to.be.a('function', 'isInterfaceType is a function');
    expect(isObjectReferenceType).to.be.a('function', 'isObjectReferenceType is a function');
    expect(isObjectType).to.be.a('function', 'isObjectType is a function');
    expect(isAbstractDeclaration).to.be.a('function', 'isAbstractDeclaration is a function');
    expect(isConditionalType).to.be.a('function', 'isObjectType is a function');
    expect(isIndexType).to.be.a('function', 'isIndexType is a function');
    expect(isPrimitiveType).to.be.a('function', 'isPrimitiveType is a function');
    expect(isIndexedAccessType).to.be.a('function', 'isIndexedAccessType is a function');
    expect(modifiersToStrings).to.be.a('function', 'modifiersToStrings is a function');

    expect(reduceDict).to.be.a('function', 'reduceDict is a function');
    expect(getRelevantTypesForSymbol).to.be.a(
      'function',
      'getRelevantTypesForSymbol is a function',
    );
    expect(isErroredType).to.be.a('function', 'isErroredType is a function');
    expect(isTupleType).to.be.a('function', 'isTupleType is a function');
    expect(isMappedType).to.be.a('function', 'isMappedType is a function');
    expect(getNameForNode).to.be.a('function', 'getNameForNode is a function');
    expect(generateHash).to.be.a('function', 'generateHash is a function');
    expect(createIdGenerator).to.be.a('function', 'generateId is a function');
    expect(createReverseResolver).to.be.a('function', 'createReverseResolver is a function');
    expect(mapDict).to.be.a('function', 'mapUem is a function');
    expect(PASSTHROUGH_REVERSE_RESOLVER).to.be.a(
      'object',
      'PASSTHROUGH_REVERSE_RESOLVER is a object',
    );
  }

  @test
  public 'no extra exports'(): void {
    expect(Object.keys(Exported).sort()).to.eql([
      'PASSTHROUGH_REVERSE_RESOLVER',
      'createIdGenerator',
      'createProgramFromCodeString',
      'createProgramFromEntries',
      'createProgramFromTsConfig',
      'createReverseResolver',
      'filterDict',
      'flagsToString',
      'forEachDict',
      'generateHash',
      'getFirstIdentifier',
      'getNameForNode',
      'getObjectFlags',
      'getRelevantTypesForSymbol',
      'getTsLibName',
      'getTypeStringForRelevantTypes',
      'isAbstractDeclaration',
      'isAnonymousType',
      'isConditionalType',
      'isDeclaration',
      'isDeclarationExported',
      'isErroredType',
      'isIndexType',
      'isIndexedAccessType',
      'isInterfaceType',
      'isMappedType',
      'isNode',
      'isObjectReferenceType',
      'isObjectType',
      'isPrimitiveType',
      'isSymbol',
      'isTupleType',
      'isType',
      'mapDict',
      'modifiersToStrings',
      'reduceDict',
    ]);
  }
}
