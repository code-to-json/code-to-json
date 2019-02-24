import { Dict } from '@mike-north/types';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import { SymbolRelevantTypes } from 'symbol';
import * as ts from 'typescript';
import { mapDict } from '../src/dict';
import { createProgramFromCodeString } from '../src/program';
import { getRelevantTypesForSymbol } from '../src/symbol';

describe('RelevantTypesForSymbol Tests', () => {
  before(() => {
    const code = `
// Symbol Value checker get type of symbol value declaration
const TextType = "Text";

// Symbol Type checker get type of symbol
type TextType = typeof TextType;

// Symbol Value
const ElementType = "Element";

// Symbol Type
type ElementType = typeof ElementType;

// hover over ElementType, you'll see it as
// type ElementType = "element" only because this is
// referenced from a type context so it is only
// using the checker to get the type
type NodeType = ElementType | TextType;

// widened so we can change default without API breakage
//
// hover over ElementType shows just the const because the symbol
// is in a value position
const DefaultType: NodeType = ElementType;


interface Foo {
  baz: string;
}

class Foo {
  bar: string;
}

namespace Foo {
  export function biz(): string[] {
    return ['abc'];
  }
}

// hover over ElementType shows both type and const
export { Foo, ElementType, TextType, NodeType, DefaultType };

`;
    const out = createProgramFromCodeString(code, 'ts');
    const p = out.program;
    sf = p.getSourceFile('module.ts')!;
    if (!sf) {
      throw new Error('No source file module.ts found');
    }
    checker = p.getTypeChecker();
    sfSym = checker.getSymbolAtLocation(sf)!;
    if (!sfSym) {
      throw new Error('SourceFile has no symbol');
    }
    exports = mapDict(sfSym.exports!, exp => ({
      sym: exp,
      type: getRelevantTypesForSymbol(out.program.getTypeChecker(), exp),
    }));
  });
  let sf: ts.SourceFile;

  let sfSym: ts.Symbol;

  let checker: ts.TypeChecker;

  let exports: Dict<{ sym: ts.Symbol; type?: SymbolRelevantTypes }>;

  it('symbols are truthy', () => {
    const { ElementType, TextType, NodeType, DefaultType, Foo } = exports;
    expect(!!ElementType!.sym).to.eql(true);
    expect(!!TextType!.sym).to.eql(true);
    expect(!!NodeType!.sym).to.eql(true);
    expect(!!Foo!.sym).to.eql(true);
    expect(!!DefaultType!.sym).to.eql(true);
  });

  it('types are truthy', () => {
    const { ElementType, TextType, NodeType, DefaultType, Foo } = exports;
    expect(!!ElementType!.type).to.eql(true);
    expect(!!TextType!.type).to.eql(true);
    expect(!!NodeType!.type).to.eql(true);
    expect(!!Foo!.type).to.eql(true);
    expect(!!DefaultType!.type).to.eql(true);
  });

  it('DefaultTypes type', () => {
    const { DefaultType } = exports;
    expect(!!DefaultType!.type!.symbolType).to.eq(false, 'symbol type');
    expect(!!DefaultType!.type!.valueDeclarationType).to.eq(false, 'value declaration');
    expect(!!DefaultType!.type!.otherDeclarationTypes).to.eq(true, 'another declaration');
    const firstDeclType = DefaultType!.type!.otherDeclarationTypes!.values().next().value;
    expect(checker.typeToString(firstDeclType!)).to.eq(
      'NodeType',
      'typeToString - first declaration',
    );
  });

  it('NodeTypes type', () => {
    const { NodeType } = exports;
    expect(!!NodeType!.type!.symbolType).to.eq(true, 'symbol type');
    expect(!!NodeType!.type!.valueDeclarationType).to.eq(false, 'value declaration');
    expect(!!NodeType!.type!.otherDeclarationTypes).to.eq(true, 'another declaration');
    expect(checker.typeToString(NodeType!.type!.symbolType!)).to.eq(
      'NodeType',
      'typeToString - symbol type',
    );
  });

  it('TextTypes type', () => {
    const { TextType } = exports;
    expect(!!TextType!.type!.symbolType).to.eq(true, 'symbol type');
    expect(!!TextType!.type!.valueDeclarationType).to.eq(false, 'value declaration');
    expect(!!TextType!.type!.otherDeclarationTypes).to.eq(true, 'another declaration');
    expect(checker.typeToString(TextType!.type!.symbolType!)).to.eq(
      '"Text"',
      'typeToString - symbol type',
    );
    const [[a, atype]] = TextType!.type!.otherDeclarationTypes!;
    expect(checker.typeToString(atype!)).to.eq('"Text"', `typeToSTring - ${a}`);
  });

  it('ElementTypes type', () => {
    const { ElementType } = exports;
    expect(!!ElementType!.type!.symbolType).to.eq(true, 'symbol type');
    expect(!!ElementType!.type!.valueDeclarationType).to.eq(false, 'value declaration');
    expect(!!ElementType!.type!.otherDeclarationTypes).to.eq(true, 'another declaration');
    expect(checker.typeToString(ElementType!.type!.symbolType!)).to.eq(
      '"Element"',
      'typeToString - symbol type',
    );
    const [[a, atype]] = ElementType!.type!.otherDeclarationTypes!;
    expect(checker.typeToString(atype!)).to.eq('"Element"', `typeToSTring - ${a}`);
  });

  it('Foos type', () => {
    const { Foo } = exports;
    const { symbolType, otherDeclarationTypes, valueDeclarationType } = Foo!.type!;
    expect(!!symbolType).to.eq(true, 'symbol type');
    expect(!!valueDeclarationType).to.eq(false, 'value declaration');
    expect(!!otherDeclarationTypes).to.eq(true, 'another declaration');
    expect(checker.typeToString(symbolType!)).to.eq('Foo', 'typeToString - symbol type');
    expect(otherDeclarationTypes!.size).to.eq(1);
    const [[a, atype]] = Foo!.type!.otherDeclarationTypes!;
    expect(checker.typeToString(atype!)).to.eq('typeof Foo', `typeToSTring - ${a.getText()}`);

    expect(atype!.getProperties().length).to.eq(2);
    expect(atype!.getProperties().map(p => p.name)).to.include.deep.members(['biz']);

    expect(symbolType!.getProperties().length).to.eq(2);
    expect(symbolType!.getProperties().map(p => p.name)).to.deep.eq(['baz', 'bar']);
  });
});
