import { Flags, flagsToString, mapUem } from '@code-to-json/utils';
import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import {
  DeclarationRef,
  isRef,
  SymbolRef,
  TypeRef
} from '../processing-queue/ref';
import serializeSignature, { SerializedSignature } from './signature';

export interface SerializedSymbol {
  thing: 'symbol';
  id: string;
  name: string;
  documentation: string;
  flags?: Flags;
  type?: TypeRef;
  members?: SymbolRef[];
  exports?: SymbolRef[];
  globalExports?: SymbolRef[];
  declarations?: DeclarationRef[];
  constructorSignatures?: SerializedSignature[];
  callSignatures?: SerializedSignature[];
  jsDocTags?: Array<{
    name: string;
    text?: string;
  }>;
}

export default function serializeSymbol(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
  ref: SymbolRef,
  queue: ProcessingQueue
): SerializedSymbol {
  const {
    exports,
    globalExports,
    members,
    flags,
    declarations,
    valueDeclaration
  } = symbol;
  // Get the construct signatures

  const typ = checker.getTypeOfSymbolAtLocation(
    symbol,
    symbol.valueDeclaration!
  );

  const details: SerializedSymbol = {
    id: ref.id,
    thing: 'symbol',
    name: symbol.getName(),
    documentation: ts.displayPartsToString(
      symbol.getDocumentationComment(checker)
    ),
    flags: flagsToString(flags, 'symbol'),
    type: queue.queue(typ, 'type', checker),
    members:
      members &&
      mapUem(members, (val: ts.Symbol) =>
        queue.queue(val, 'symbol', checker)
      ).filter(isRef),
    exports:
      exports &&
      mapUem(exports, (val: ts.Symbol) =>
        queue.queue(val, 'symbol', checker)
      ).filter(isRef),
    globalExports:
      globalExports &&
      mapUem(globalExports, (val: ts.Symbol) =>
        queue.queue(val, 'symbol', checker)
      ).filter(isRef)
    // declarations:
    //   declarations &&
    //   declarations
    //     .map((d) => {
    //       if (d.getSourceFile().isDeclarationFile) {
    //         return; // Skip anything that's in a declaration file
    //         // TODO: figure out a better boundary for skipping stuff (i.e., things that can be linked to on MDN)
    //       }
    //       return queue.queue(d, 'declaration', checker);
    //     })
    //     .filter(isRef)
  };

  if (valueDeclaration) {
    const valDeclType = checker.getTypeOfSymbolAtLocation(
      symbol,
      valueDeclaration
    );
    details.constructorSignatures = valDeclType
      .getConstructSignatures()
      .map((s) => serializeSignature(s, checker, queue));
    details.callSignatures = valDeclType
      .getCallSignatures()
      .map((s) => serializeSignature(s, checker, queue));
  }
  const jsDocTags = symbol.getJsDocTags();
  if (jsDocTags.length > 0) {
    details.jsDocTags = [...jsDocTags];
  }
  return details;
}
