import {
  FormattedDeclaration,
  FormattedEntity,
  FormattedNode,
  FormattedSignatureAttributes,
  FormattedSourceFile,
  FormattedSourceFileAttributes,
  FormattedSymbol,
  FormattedSymbolAttributes,
  FormattedType,
  FormattedTypeAttributes,
  HasDocumentation,
} from '@code-to-json/formatter';
import { RefResolver } from '@code-to-json/utils';
import { Dict } from '@mike-north/types';

export interface LinkedFormattedOutputData {
  symbols: Dict<Readonly<LinkedFormattedSymbol>>;
  types: Dict<Readonly<LinkedFormattedType>>;
  nodes: Dict<Readonly<LinkedFormattedNode>>;
  declarations: Dict<Readonly<LinkedFormattedDeclaration>>;
  sourceFiles: Dict<Readonly<LinkedFormattedSourceFile>>;
}
/**
 * @internal
 */
export type LinkedFormattedRefResolver = RefResolver<LinkedFormattedOutputMap>;

export interface LinkedFormattedOutputMap {
  s: Readonly<LinkedFormattedSymbol & FormattedSymbol>;
  t: Readonly<LinkedFormattedType & FormattedType>;
  n: Readonly<LinkedFormattedNode & FormattedNode>;
  d: Readonly<LinkedFormattedDeclaration & FormattedDeclaration>;
  f: Readonly<LinkedFormattedSourceFile & FormattedSourceFile>;
}

/**
 * @internal
 */
export interface MaybeLinkedFormattedOutputData {
  symbols: Dict<Readonly<LinkedFormattedSymbol & FormattedSymbol>>;
  types: Dict<Readonly<LinkedFormattedType & FormattedType>>;
  nodes: Dict<Readonly<LinkedFormattedNode & FormattedNode>>;
  declarations: Dict<Readonly<LinkedFormattedDeclaration & FormattedDeclaration>>;
  sourceFiles: Dict<Readonly<LinkedFormattedSourceFile & FormattedSourceFile>>;
}

export interface LinkedFormattedTypeRelationships {
  symbol?: LinkedFormattedSymbol;
  constraint?: LinkedFormattedType;
  properties?: Dict<LinkedFormattedSymbol>;
  baseTypes?: LinkedFormattedType[];
  thisType?: LinkedFormattedType;
  numberIndexType?: LinkedFormattedType;
  stringIndexType?: LinkedFormattedType;
  defaultType?: LinkedFormattedType;
  callSignatures?: LinkedFormattedSignature[];
  constructorSignatures?: LinkedFormattedSignature[];
  typeParameters?: LinkedFormattedType[];
  types?: LinkedFormattedType[];
  conditionalInfo?: LinkedFormattedTypeConditionInfo;
}

export interface LinkedFormattedType
  extends FormattedTypeAttributes,
    LinkedFormattedTypeRelationships,
    HasDocumentation {}

export interface LinkedFormattedTypeConditionInfo {
  extendsType: LinkedFormattedType;
  checkType: LinkedFormattedType;
  falseType?: LinkedFormattedType;
  trueType?: LinkedFormattedType;
}

export interface LinkedFormattedHeritageClause {
  kind: 'extends' | 'implements';
  types: LinkedFormattedType[];
}

export interface LinkedFormattedSymbol
  extends HasDocumentation,
    FormattedSymbolAttributes,
    LinkedFormattedSymbolRelationships {}

export interface LinkedFormattedSymbolRelationships {
  otherDeclarationTypes?: Array<{
    declaration: LinkedFormattedDeclaration;
    type?: LinkedFormattedType;
  }>;
  decorators?: LinkedFormattedSymbol[];
  exports?: Dict<LinkedFormattedSymbol>;
  globalExports?: Dict<LinkedFormattedSymbol>;
  members?: Dict<LinkedFormattedSymbol>;
  properties?: Dict<LinkedFormattedSymbol>;
  type?: LinkedFormattedType;
  valueType?: LinkedFormattedType;
  related?: LinkedFormattedSymbol[];
  valueDeclaration?: LinkedFormattedDeclaration;
  heritageClauses?: LinkedFormattedHeritageClause[];
}

export interface LinkedFormattedSourceFileRelationships {
  symbol?: LinkedFormattedSymbol;
}

export interface LinkedFormattedSourceFile
  extends FormattedSourceFileAttributes,
    LinkedFormattedSourceFileRelationships,
    HasDocumentation {}

export interface LinkedFormattedSignatureRelationships {
  parameters?: Array<{ name: string; type?: LinkedFormattedType }>;
  typeParameters?: LinkedFormattedType[];
  returnType?: LinkedFormattedType;
}

export interface LinkedFormattedSignature
  extends HasDocumentation,
    FormattedSignatureAttributes,
    LinkedFormattedSignatureRelationships {}

export interface LinkedFormattedNode<Type extends string = 'node'> extends FormattedEntity<Type> {
  text: string;
  kind: Type;
  decorators?: string[];
  location?: LinkedFormattedCodeRange;
  modifiers?: string[];
  isExposed: boolean;
  isExported: boolean;
}

export type LinkedFormattedCodePoisition = [LinkedFormattedSourceFile, number, number];

export type LinkedFormattedCodeRange = [LinkedFormattedSourceFile, number, number, number, number];

export interface LinkedFormattedDeclaration extends FormattedNode<'declaration'> {}
