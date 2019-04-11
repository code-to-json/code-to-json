import { getDeclarationFiles } from '@code-to-json/test-helpers';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import * as ts from 'typescript';
import { createIdGenerator, entityToString } from '../src/generate-id';
import { createProgramFromCodeString, mapDict } from '../src/index';

describe('ID generation tests', () => {
  let sourceFile: ts.SourceFile;

  let classDeclaration: ts.Declaration;

  let varDeclaration: ts.VariableDeclaration;

  let sourceFileSym: ts.Symbol;

  let sourceFileType: ts.Type;

  let classSym: ts.Symbol;

  let classType: ts.Type;

  let varSym: ts.Symbol;

  let checker: ts.TypeChecker;

  let node: ts.Node;

  before(() => {
    const { program } = createProgramFromCodeString(
      `
export class Car {
  public wheels: number = 4;
  constructor() {
    console.log('We are driving');
  }
}
export const x: string = 'foo';
`,
      'ts',
    );
    const { nonDeclarationFiles } = getDeclarationFiles(program.getSourceFiles());
    [sourceFile] = nonDeclarationFiles;
    checker = program.getTypeChecker();

    const sym = checker.getSymbolAtLocation(sourceFile);
    if (!sym) {
      throw new Error('no symbol for SourceFile');
    }
    sourceFileSym = sym;
    sourceFileType = checker.getTypeOfSymbolAtLocation(sourceFileSym, sourceFile);

    const { exports: fileExports } = sourceFileSym;
    if (!fileExports) {
      throw new Error('File has no exports');
    }
    const exportedSymbols: ts.Symbol[] = [];
    const thing = fileExports.values();
    let thingV = thing.next();
    while (!thingV.done) {
      exportedSymbols.push(thingV.value);
      thingV = thing.next();
    }
    expect(exportedSymbols.length).to.eql(2);
    [classSym, varSym] = exportedSymbols;
    classType = checker.getDeclaredTypeOfSymbol(classSym);
    expect(classSym.declarations.length).to.eql(1);
    [classDeclaration] = classSym.declarations;

    expect(varSym.declarations.length).to.eql(1);
    [varDeclaration] = varSym.declarations as ts.VariableDeclaration[];
    node = varDeclaration.initializer!.parent.getChildAt(4);
  });

  it('generateId for sourceFile', async () => {
    const generateId = createIdGenerator(checker);
    expect(generateId(sourceFile)).to.eql(['ok', 'F01m4wnf2ptes']);
  });

  it('generateId for symbol', async () => {
    const generateId = createIdGenerator(checker);
    expect(generateId(sourceFileSym)[1])
      .to.be.a('string')
      .and.to.have.lengthOf(13);
  });

  it('generateId for type', async () => {
    const generateId = createIdGenerator(checker);
    expect(generateId(classType)[1])
      .to.be.a('string')
      .and.to.have.length.greaterThan(0);
  });

  it('generateId for class declaration', async () => {
    const generateId = createIdGenerator(checker);
    expect(generateId(classDeclaration)[1])
      .to.be.a('string')
      .and.to.have.lengthOf(13);
  });

  it('generateId for variable declaration', async () => {
    const generateId = createIdGenerator(checker);
    expect(generateId(varDeclaration)[1])
      .to.be.a('string')
      .and.to.have.lengthOf(13);
  });

  it('generateId for class members and their children', async () => {
    const generateId = createIdGenerator(checker);

    const { members } = classSym;
    if (!members) {
      throw new Error('No members in class');
    }
    const memberSyms = mapDict(members, s => s);
    const memberSym = memberSyms[Object.keys(memberSyms)[0]];
    if (!memberSym) {
      throw new Error('Expected to find at least one member symbol');
    }
    const [memberDecl] = memberSym.declarations;
    expect(memberDecl.getText()).to.eql('public wheels: number = 4;');
    expect(generateId(memberDecl)[1])
      .to.be.a('string')
      .and.to.have.lengthOf(13);
    ts.forEachChild(memberDecl, ch => {
      expect(generateId(ch)[1])
        .to.be.a('string')
        .and.to.have.lengthOf(13);
    });
  });

  it('generateId for null', async () => {
    const generateId = createIdGenerator(checker);

    expect(() => generateId(null as any)).to.throw('Cannot generate an ID for empty values');
  });

  it('generateId for undefined', async () => {
    const generateId = createIdGenerator(checker);

    expect(() => generateId(undefined as any)).to.throw('Cannot generate an ID for empty values');
  });

  it('generateId for 8', async () => {
    const generateId = createIdGenerator(checker);

    expect(() => generateId(8 as any)).to.throw('Cannot generate an id for this object');
  });

  it('stable hashing', () => {
    const generateId = createIdGenerator(checker);

    expect(generateId(classDeclaration)).to.eql(['ok', 'D01m4wm4wrlxj'], 'class declaration');
    expect(generateId(classSym)).to.eql(['ok', 'S01m4wntwmh9a'], 'class symbol');
    expect(generateId(classType)).to.eql(['ok', 'T01m4wlnjqf0g'], 'class type');
    expect(generateId(sourceFile)).to.eql(['ok', 'F01m4wnf2ptes'], 'source file');
    expect(generateId(sourceFileSym)).to.eql(['ok', 'S01m4wnj0ln0d'], 'source file symbol');

    expect(generateId(varSym)).to.eql(['ok', 'S01m4wmqaygbn'], 'variable symbol');
    expect(generateId(varDeclaration)).to.eql(['ok', 'D01m4wlurlp4f'], 'variable declaration');
  });

  it('entity stringifying', () => {
    expect(entityToString(undefined, checker)).to.eq('undefined');
    expect(entityToString('foo', checker)).to.eq('foo');
    expect(entityToString(6, checker)).to.eq('6');
    expect(entityToString(classSym, checker)).to.eq('Car');
    expect(entityToString(classType, checker)).to.eq('Car');
    expect(entityToString(sourceFile, checker)).to.eq('FILE: module.ts');
    expect(entityToString(sourceFileType, checker)).to.eq('typeof import("module")');
    expect(entityToString(node, checker)).to.eq("'foo'");
    expect(entityToString(classDeclaration, checker)).to.eq(`export class Car {
  public wheels: number = 4;
  constructor() {
    console.log('We are driving');
  }
}`);
  });
});
