import {
  AmdDependency,
  HasDocumentation,
  SerializedDeclaration,
  SerializedEntity,
  SerializedNode,
  SerializedSignatureAttributes,
  SerializedSourceFile,
  SerializedSourceFileAttributes,
  SerializedSymbol,
  SerializedSymbolAttributes,
  SerializedType,
  SerializedTypeAttributes,
} from '@code-to-json/core';
import { RefResolver } from '@code-to-json/utils';
import { Dict } from '@mike-north/types';

export interface LinkedWalkerOutputData {
  symbols: Dict<Readonly<LinkedSymbol>>;
  types: Dict<Readonly<LinkedType>>;
  nodes: Dict<Readonly<LinkedNode>>;
  declarations: Dict<Readonly<LinkedDeclaration>>;
  sourceFiles: Dict<Readonly<LinkedSourceFile>>;
}
/**
 * @internal
 */
export type LinkedRefResolver = RefResolver<LinkedOutputMap>;

export interface LinkedOutputMap {
  symbol: Readonly<LinkedSymbol & SerializedSymbol>;
  type: Readonly<LinkedType & SerializedType>;
  node: Readonly<LinkedNode & SerializedNode>;
  declaration: Readonly<LinkedDeclaration & SerializedDeclaration>;
  sourceFile: Readonly<LinkedSourceFile & SerializedSourceFile>;
}

/**
 * @internal
 */
export interface MaybeLinkedWalkerOutputData {
  symbols: Dict<Readonly<LinkedSymbol & SerializedSymbol>>;
  types: Dict<Readonly<LinkedType & SerializedType>>;
  nodes: Dict<Readonly<LinkedNode & SerializedNode>>;
  declarations: Dict<Readonly<LinkedDeclaration & SerializedDeclaration>>;
  sourceFiles: Dict<Readonly<LinkedSourceFile & SerializedSourceFile>>;
}

export interface LinkedTypeRelationships {
  conditionalInfo?: LinkedTypeConditionInfo;
  numberIndexType?: LinkedType;
  stringIndexType?: LinkedType;
  default?: LinkedType;
  location?: LinkedCodeRange;

  types?: LinkedType[];
  baseTypes?: LinkedType[];
  symbol?: LinkedSymbol;
  target?: LinkedType;
  relatedTypes?: LinkedType[];
  sourceFile?: LinkedSourceFile;
  typeParameters?: LinkedType[];
  constraint?: LinkedType;
  templateType?: LinkedType;
  thisType?: LinkedType;
  modifiersType?: LinkedType;
  aliasSymbol?: LinkedSymbol;
  defaultType?: LinkedType;
  simplified?: LinkedType;
  indexType?: LinkedType;
  objectType?: LinkedType;
  properties?: Dict<LinkedSymbol>;
  constructorSignatures?: LinkedSignature[];
  callSignatures?: LinkedSignature[];
}

export interface LinkedType
  extends SerializedTypeAttributes,
    LinkedTypeRelationships,
    HasDocumentation {}

export interface LinkedTypeConditionInfo {
  extendsType: LinkedType;
  checkType: LinkedType;
  falseType?: LinkedType;
  trueType?: LinkedType;
}
export interface LinkedSymbol
  extends HasDocumentation,
    SerializedSymbolAttributes,
    LinkedSymbolRelationships {}

export interface LinkedSymbolRelationships {
  symbolType?: LinkedType;
  valueDeclarationType?: LinkedType;
  exports?: Dict<LinkedSymbol>;
  members?: Dict<LinkedSymbol>;
  decorators?: LinkedSymbol[];
  sourceFile?: LinkedSourceFile;
  globalExports?: Dict<LinkedSymbol>;
  relatedSymbols?: LinkedSymbol[];
}

export interface LinkedSourceFileRelationships {
  amdDependencies?: AmdDependency[];
  symbol?: LinkedSymbol;
  referencedFiles?: LinkedFileReference[];
  typeReferenceDirectives?: LinkedFileReference[];
  libReferenceDirectives?: LinkedFileReference[];
}

export interface LinkedSourceFile
  extends SerializedSourceFileAttributes,
    LinkedSourceFileRelationships,
    HasDocumentation {}

export interface LinkedSignatureRelationships {
  returnType?: LinkedType;
  parameters?: LinkedSymbol[];
  typeParameters?: LinkedType[];
  typePredicate?: LinkedType;
}

export interface LinkedSignature
  extends SerializedSignatureAttributes,
    LinkedSignatureRelationships {}

export interface LinkedNode<Type extends string = 'node'> extends SerializedEntity<Type> {
  text: string;
  kind: string;
  decorators?: string[];
  location?: LinkedCodeRange;
  modifiers?: string[];
  isExposed: boolean;
  isExported: boolean;
}

export type LinkedCodePoisition = [LinkedSourceFile, number, number];

export type LinkedCodeRange = [LinkedSourceFile, number, number, number, number];

export interface LinkedFileReference {
  name?: string;
  location?: LinkedCodeRange;
}
export interface LinkedDeclaration extends SerializedNode<'declaration'> {}
