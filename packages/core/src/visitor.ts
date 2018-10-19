// import * as ts from 'typescript';

// import {
//   flagsToString,
//   isDeclaration,
//   isNode,
//   isSymbol,
//   isType,
//   mapUem
// } from '@code-to-json/utils';
// import generateId from './generate-id';
// import serializeSignature from './serializers/signature';
// import serializeSymbol from './serializers/symbol';
// import {
//   EntityMap,
//   Ref,
//   SerializedDeclarationObj,
//   SerializedEntityMap,
//   SerializedSymbolObj,
//   SerializedTypeObj
// } from './types';

// interface IWalkVisitor {
//   hasSerializedReferenceFor<K extends keyof EntityMap>(
//     thing: EntityMap[K]
//   ): Ref<K> | undefined;
//   queue<K extends keyof EntityMap>(thing: EntityMap[K]): Ref<K>;
// }

// interface ItemData<K extends keyof EntityMap> {
//   id: string;
//   processed: boolean;
//   serialized?: SerializedEntityMap[K];
// }

// export default class WalkVisitor implements IWalkVisitor {
//   protected types = new Map<ts.Type, ItemData<'type'>>();
//   protected declarations = new Map<ts.Declaration, ItemData<'declaration'>>();
//   protected symbols = new Map<ts.Symbol, ItemData<'symbol'>>();

//   public queue<K extends keyof EntityMap>(thing: EntityMap[K]): Ref<K> {
//     const existingRef = this.hasSerializedReferenceFor(thing);
//     if (existingRef) {
//       return existingRef;
//     }
//     const id = generateId(thing);
//     if (isNode(thing) && isDeclaration(thing)) {
//       this.declarations.set(thing, { id, processed: false });
//       return { id, refType: 'declaration' as K };
//     } else if (isSymbol(thing)) {
//       this.symbols.set(thing, { id, processed: false });
//       return { id, refType: 'symbol' as K };
//     } else if (isType(thing)) {
//       this.types.set(thing, { id, processed: false });
//       return { id, refType: 'type' as K };
//     } else {
//       // console.log(thing);
//       // debugger;
//       // throw new Error(
//       //   'Received something that was neither a type, a declaration or a symbol'
//       // );
//     }
//   }

//   public hasSerializedReferenceFor<K extends keyof EntityMap>(
//     thing: EntityMap[K]
//   ): Ref<K> | undefined {
//     let map: Map<EntityMap[K], { id: string }>;
//     let refType: K;
//     if (isNode(thing) && isDeclaration(thing)) {
//       map = this.declarations;
//       refType = 'declaration' as K;
//     } else if (isSymbol(thing)) {
//       map = this.symbols;
//       refType = 'symbol' as K;
//     } else if (isType(thing)) {
//       map = this.types;
//       refType = 'type' as K;
//     } else {
//       console.log(thing);
//       // tslint:disable-next-line:no-debugger
//       // debugger;
//       // throw new Error(
//       //   'Received something that was neither a type, a declaration or a symbol'
//       // );
//       return;
//     }
//     if (!map) {
//       throw new Error('Problem retrieving id map');
//     }
//     const existing = map.get(thing);
//     if (typeof existing === 'undefined') {
//       return;
//     } else {
//       return { refType: refType as K, id: existing.id };
//     }
//   }

//   public drain(checker: ts.TypeChecker) {
//     this.symbols.forEach((itemData, sym) => {
//       if (itemData.processed) {
//         return;
//       }
//       itemData.serialized = this.processSymbol(checker, itemData, sym);
//       itemData.processed = true;
//     });
//     this.types.forEach((itemData, typ) => {
//       if (itemData.processed) {
//         return;
//       }
//       itemData.serialized = this.processType(checker, itemData, typ);
//       itemData.processed = true;
//     });
//     this.declarations.forEach((itemData, decl) => {
//       if (itemData.processed) {
//         return;
//       }
//       itemData.serialized = this.processDeclaration(checker, itemData, decl);
//       itemData.processed = true;
//     });
//   }

//   public drainUntilDone(
//     checker: ts.TypeChecker
//   ): {
//     types: SerializedTypeObj[];
//     symbols: SerializedSymbolObj[];
//     declarations: SerializedDeclarationObj[];
//   } {
//     this.drain(checker);
//     return {
//       types: [],
//       symbols: [],
//       declarations: []
//     };
//   }

//   public isProcessed(): boolean {
//     // For each of these lists
//     return [this.declarations, this.symbols, this.types].reduce(
//       (isDone, map) => {
//         if (!isDone) {
//           // If we've already found something that requires more processing
//           return false;
//         }
//         // otherwise, look for any un-processed items, returning true if any are found
//         return [...map.values()].reduce(
//           // indicate we're not fully processed if any item is found that's not processed
//           (listDone, item) => !item.processed,
//           true // assume the list is done, until proven otherwise
//         );
//       },
//       true // assume we're done, until proven otherwise
//     );
//   }

//   public processSymbol(
//     checker: ts.TypeChecker,
//     data: ItemData<'symbol'>,
//     symbol: ts.Symbol
//   ): SerializedSymbolObj {
//     const { exports, members, flags, declarations, valueDeclaration } = symbol;
//     // Get the construct signatures

//     const typ = checker.getTypeOfSymbolAtLocation(
//       symbol,
//       symbol.valueDeclaration!
//     );

//     const details: SerializedSymbolObj = {
//       id: data.id,
//       thing: 'symbol',
//       name: symbol.getName(),
//       documentation: ts.displayPartsToString(
//         symbol.getDocumentationComment(checker)
//       ),
//       flags: flagsToString(flags, 'symbol'),
//       type: this.visit(typ),
//       members: members && mapUem(members, (val: ts.Symbol) => this.visit(val)),
//       exports: exports && mapUem(exports, (val: ts.Symbol) => this.visit(val)),
//       declarations: declarations && declarations.map(d => this.visit(d))
//     };
//     if (valueDeclaration) {
//       const valDeclType = checker.getTypeOfSymbolAtLocation(
//         symbol,
//         valueDeclaration
//       );
//       details.constructorSignatures = valDeclType
//         .getConstructSignatures()
//         .map(s => serializeSignature(s, checker, this));
//       details.callSignatures = valDeclType
//         .getCallSignatures()
//         .map(s => serializeSignature(s, checker, this));
//     }
//     return details;
//   }
//   public processType(
//     checker: ts.TypeChecker,
//     data: ItemData<'type'>,
//     typ: ts.Type
//   ): SerializedTypeObj {
//     const { flags, aliasSymbol, aliasTypeArguments, symbol } = typ;

//     const typeData = {
//       id: data.id,
//       thing: 'type' as 'type',
//       symbol: symbol && this.visit<'symbol'>(symbol),
//       typeString: checker.typeToString(typ),
//       aliasTypeArguments:
//         aliasTypeArguments &&
//         aliasTypeArguments.map(ata => this.visit<'type'>(ata)),
//       aliasSymbol: aliasSymbol && this.visit<'symbol'>(aliasSymbol),
//       flags: flagsToString(flags, 'type')
//     };
//     return typeData;
//   }
//   public processDeclaration(
//     checker: ts.TypeChecker,
//     data: ItemData<'declaration'>,
//     decl: ts.Declaration
//   ): SerializedDeclarationObj {
//     const details: SerializedDeclarationObj = {
//       id: data.id,
//       thing: 'declaration',
//       text: decl.getText()
//     };
//     // const name = isNamedDeclaration(decl) && decl.name;
//     // const sym = checker.getSymbolAtLocation(name || decl);
//     // if (sym) {
//     //   if (name) {
//     //     return {
//     //       name: name.getText()
//     //     };
//     //   } else {
//     //     return serializeSymbol(sym, checker, walkData);
//     //   }
//     // } else {
//     //   const typ = checker.getTypeAtLocation(name || decl);
//     //   if (typ) {
//     //     return serializeType(typ, checker, walkData);
//     //   }
//     //   debugger;
//     // }
//     return details;
//   }
//   public visit<K extends keyof EntityMap>(thing: EntityMap[K]): Ref<K> {
//     return this.queue(thing);
//   }
// }
