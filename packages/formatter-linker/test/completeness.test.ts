import {
  FormattedSymbol,
  FormattedType,
  FormattedSourceFile,
  FormattedDeclaration,
  FormattedNode,
} from '@code-to-json/formatter';
import { OptionalPropertyNamesOf, RequiredPropertyNamesOf } from '@mike-north/types';
import {
  LinkedFormattedSymbol,
  LinkedFormattedType,
  LinkedFormattedSourceFile,
  LinkedFormattedDeclaration,
  LinkedFormattedNode,
} from '../src';

function validateSymbol1(_keys: keyof FormattedSymbol) {}
validateSymbol1('members' as keyof LinkedFormattedSymbol);
function validateSymbol2(_keys: keyof LinkedFormattedSymbol) {}
validateSymbol2('members' as keyof FormattedSymbol);

function validateType1(_keys: keyof FormattedType) {}
validateType1('symbol' as keyof LinkedFormattedType);
function validateType2(_keys: keyof LinkedFormattedType) {}
validateType2('symbol' as keyof FormattedType);

function validateSourceFile1(_keys: keyof FormattedSourceFile) {}
validateSourceFile1('id' as keyof LinkedFormattedSourceFile);
function validateSourceFile2(_keys: keyof LinkedFormattedSourceFile) {}
validateSourceFile2('id' as keyof FormattedSourceFile);

function validateDeclaration1(_keys: keyof FormattedDeclaration) {}
validateDeclaration1('id' as keyof LinkedFormattedDeclaration);
function validateDeclaration2(_keys: keyof LinkedFormattedDeclaration) {}
validateDeclaration2('id' as keyof FormattedDeclaration);

function validateNode1(_keys: keyof FormattedNode) {}
validateNode1('text' as keyof LinkedFormattedNode);
function validateNode2(_keys: keyof LinkedFormattedNode) {}
validateNode2('text' as keyof FormattedNode);

// == Optional Validation == //

function validateOptionalSymbol1(_keys: OptionalPropertyNamesOf<FormattedSymbol>) {}
validateOptionalSymbol1('valueDeclarationType' as OptionalPropertyNamesOf<LinkedFormattedSymbol>);
function validateOptionalSymbol2(_keys: OptionalPropertyNamesOf<LinkedFormattedSymbol>) {}
validateOptionalSymbol2('valueDeclarationType' as OptionalPropertyNamesOf<FormattedSymbol>);

function validateOptionalType1(_keys: OptionalPropertyNamesOf<FormattedType>) {}
validateOptionalType1('valueDeclarationType' as OptionalPropertyNamesOf<LinkedFormattedType>);
function validateOptionalType2(_keys: OptionalPropertyNamesOf<LinkedFormattedType>) {}
validateOptionalType2('valueDeclarationType' as OptionalPropertyNamesOf<FormattedType>);

function validateOptionalDeclaration1(_keys: OptionalPropertyNamesOf<FormattedDeclaration>) {}
validateOptionalDeclaration1('id' as OptionalPropertyNamesOf<LinkedFormattedDeclaration>);
function validateOptionalDeclaration2(_keys: OptionalPropertyNamesOf<LinkedFormattedDeclaration>) {}
validateOptionalDeclaration2('id' as OptionalPropertyNamesOf<FormattedDeclaration>);

function validateOptionalNode1(_keys: OptionalPropertyNamesOf<FormattedNode>) {}
validateOptionalNode1('id' as OptionalPropertyNamesOf<LinkedFormattedNode>);
function validateOptionalNode2(_keys: OptionalPropertyNamesOf<LinkedFormattedNode>) {}
validateOptionalNode2('id' as OptionalPropertyNamesOf<FormattedNode>);

// == Required Validation == //

function validateRequiredSymbol1(_keys: RequiredPropertyNamesOf<FormattedSymbol>) {}
validateRequiredSymbol1('valueDeclarationType' as RequiredPropertyNamesOf<LinkedFormattedSymbol>);
function validateRequiredSymbol2(_keys: RequiredPropertyNamesOf<LinkedFormattedSymbol>) {}
validateRequiredSymbol2('valueDeclarationType' as RequiredPropertyNamesOf<FormattedSymbol>);

function validateRequiredType1(_keys: RequiredPropertyNamesOf<FormattedType>) {}
validateRequiredType1('valueDeclarationType' as RequiredPropertyNamesOf<LinkedFormattedType>);
function validateRequiredType2(_keys: RequiredPropertyNamesOf<LinkedFormattedType>) {}
validateRequiredType2('valueDeclarationType' as RequiredPropertyNamesOf<FormattedType>);

function validateRequiredDeclaration1(_keys: RequiredPropertyNamesOf<FormattedDeclaration>) {}
validateRequiredDeclaration1('id' as RequiredPropertyNamesOf<LinkedFormattedDeclaration>);
function validateRequiredDeclaration2(_keys: RequiredPropertyNamesOf<LinkedFormattedDeclaration>) {}
validateRequiredDeclaration2('id' as RequiredPropertyNamesOf<FormattedDeclaration>);

function validateRequiredNode1(_keys: RequiredPropertyNamesOf<FormattedNode>) {}
validateRequiredNode1('id' as RequiredPropertyNamesOf<LinkedFormattedNode>);
function validateRequiredNode2(_keys: RequiredPropertyNamesOf<LinkedFormattedNode>) {}
validateRequiredNode2('id' as RequiredPropertyNamesOf<FormattedNode>);
