import { Flags } from '@code-to-json/utils';
import * as ts from 'typescript';

// export interface SerializedSignature {
//   parameters: SerializedSymbol[];
//   returnType: string; // TODO: type?
//   documentation: string;
// }

export interface EntityMap {
  declaration: ts.Declaration;
  symbol: ts.Symbol;
  type: ts.Type;
}
// export interface SerializedEntityMap {
//   declaration: SerializedDeclarationObj;
//   symbol: SerializedSymbolObj;
//   type: SerializedTypeObj;
// // }
// export interface SerializedReferenceMap {
//   declaration: Ref<'declaration'>;
//   symbol: Ref<'symbol'>;
//   type: Ref<'type'>;
// }

// export interface SerializedSymbolObj {
//   thing: 'symbol';
//   id: string;
//   name: string;
//   documentation: string;
//   flags?: Flags;
//   type: Ref<'type'>;
//   members?: SerializedSymbol[];
//   exports?: SerializedSymbol[];
//   declarations: SerializedDeclaration[];
//   constructorSignatures?: SerializedSignature[];
//   callSignatures?: SerializedSignature[];
// }

// export interface SerializedTypeObj {
//   thing: 'type';
//   id: string;
//   symbol: Ref<'symbol'>;
//   typeString: string;
//   aliasTypeArguments?: SerializedType[];
//   aliasSymbol?: SerializedSymbol;
//   flags?: Flags;
// }

export interface SerializedDeclarationObj {
  thing: 'declaration';
  id: string;
  text: string;
}

// export type SerializedSymbol = SerializedSymbolObj | Ref<'symbol'>;
// export type SerializedType = SerializedTypeObj | Ref<'type'>;
// export type SerializedDeclaration =
//   | SerializedDeclarationObj
//   | Ref<'declaration'>;
