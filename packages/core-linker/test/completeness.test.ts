import {
  SerializedSymbol,
  SerializedType,
  SerializedSourceFile,
  SerializedDeclaration,
  SerializedNode,
} from '@code-to-json/core';
import { RequiredPropertyNamesOf, OptionalPropertyNamesOf } from '@mike-north/types';
import { LinkedSymbol, LinkedType, LinkedSourceFile, LinkedDeclaration, LinkedNode } from '../src';

/**
 * These tests are intended to ensure that for Symbol, Type, Declaration, Node and SourceFile,
 * the linked and un-linked flavors of the types are conceptually-equivalent representations
 */

// == Basic Validation == //

function validateSymbol1(_keys: keyof SerializedSymbol) {}
validateSymbol1('symbolType' as keyof LinkedSymbol);
function validateSymbol2(_keys: keyof LinkedSymbol) {}
validateSymbol2('symbolType' as keyof SerializedSymbol);

function validateType1(_keys: keyof SerializedType) {}
validateType1('symbol' as keyof LinkedType);
function validateType2(_keys: keyof LinkedType) {}
validateType2('symbol' as keyof SerializedType);

function validateSourceFile1(_keys: keyof SerializedSourceFile) {}
validateSourceFile1('id' as keyof LinkedSourceFile);
function validateSourceFile2(_keys: keyof LinkedSourceFile) {}
validateSourceFile2('id' as keyof SerializedSourceFile);

function validateDeclaration1(_keys: keyof SerializedDeclaration) {}
validateDeclaration1('id' as keyof LinkedDeclaration);
function validateDeclaration2(_keys: keyof LinkedDeclaration) {}
validateDeclaration2('id' as keyof SerializedDeclaration);

function validateNode1(_keys: keyof SerializedNode) {}
validateNode1('syntaxKind' as keyof LinkedNode);
function validateNode2(_keys: keyof LinkedNode) {}
validateNode2('syntaxKind' as keyof SerializedNode);

// == Optional Validation == //

function validateOptionalSymbol1(_keys: OptionalPropertyNamesOf<SerializedSymbol>) {}
validateOptionalSymbol1('valueDeclarationType' as OptionalPropertyNamesOf<LinkedSymbol>);
function validateOptionalSymbol2(_keys: OptionalPropertyNamesOf<LinkedSymbol>) {}
validateOptionalSymbol2('valueDeclarationType' as OptionalPropertyNamesOf<SerializedSymbol>);

function validateOptionalType1(_keys: OptionalPropertyNamesOf<SerializedType>) {}
validateOptionalType1('valueDeclarationType' as OptionalPropertyNamesOf<LinkedType>);
function validateOptionalType2(_keys: OptionalPropertyNamesOf<LinkedType>) {}
validateOptionalType2('valueDeclarationType' as OptionalPropertyNamesOf<SerializedType>);

function validateOptionalDeclaration1(_keys: OptionalPropertyNamesOf<SerializedDeclaration>) {}
validateOptionalDeclaration1('id' as OptionalPropertyNamesOf<LinkedDeclaration>);
function validateOptionalDeclaration2(_keys: OptionalPropertyNamesOf<LinkedDeclaration>) {}
validateOptionalDeclaration2('id' as OptionalPropertyNamesOf<SerializedDeclaration>);

function validateOptionalNode1(_keys: OptionalPropertyNamesOf<SerializedNode>) {}
validateOptionalNode1('id' as OptionalPropertyNamesOf<LinkedNode>);
function validateOptionalNode2(_keys: OptionalPropertyNamesOf<LinkedNode>) {}
validateOptionalNode2('id' as OptionalPropertyNamesOf<SerializedNode>);

// == Required Validation == //

function validateRequiredType1(_keys: RequiredPropertyNamesOf<SerializedType>) {}
validateRequiredType1('valueDeclarationType' as RequiredPropertyNamesOf<LinkedType>);
function validateRequiredType2(_keys: RequiredPropertyNamesOf<LinkedType>) {}
validateRequiredType2('valueDeclarationType' as RequiredPropertyNamesOf<SerializedType>);

function validateRequiredDeclaration1(_keys: RequiredPropertyNamesOf<SerializedDeclaration>) {}
validateRequiredDeclaration1('id' as RequiredPropertyNamesOf<LinkedDeclaration>);
function validateRequiredDeclaration2(_keys: RequiredPropertyNamesOf<LinkedDeclaration>) {}
validateRequiredDeclaration2('id' as RequiredPropertyNamesOf<SerializedDeclaration>);

function validateRequiredSymbol1(_keys: RequiredPropertyNamesOf<SerializedSymbol>) {}
validateRequiredSymbol1('valueDeclarationType' as RequiredPropertyNamesOf<LinkedSymbol>);
function validateRequiredSymbol2(_keys: RequiredPropertyNamesOf<LinkedSymbol>) {}
validateRequiredSymbol2('valueDeclarationType' as RequiredPropertyNamesOf<SerializedSymbol>);

function validateRequiredNode1(_keys: RequiredPropertyNamesOf<SerializedNode>) {}
validateRequiredNode1('id' as RequiredPropertyNamesOf<LinkedNode>);
function validateRequiredNode2(_keys: RequiredPropertyNamesOf<LinkedNode>) {}
validateRequiredNode2('id' as RequiredPropertyNamesOf<SerializedNode>);
