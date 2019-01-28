import { isDefined } from '@code-to-json/utils';
import { filterDict, mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import SingleFileAcceptanceTestCase from './helpers/test-case';

@suite
@slow(800)
export class EnumFormatterAcceptanceTests {
  @test public async 'regular enum'() {
    const code = `export enum Suit { heart, club, diamond, spade }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    expect(Object.keys(fileExports)).to.deep.eq(['Suit']);
    const enumSymbol = fileExports.Suit!;
    expect(enumSymbol.name).to.eq('Suit');
    const enumType = t.resolveReference(enumSymbol.type);
    expect(enumType.text).to.eq('typeof Suit');
    expect(!!enumSymbol.exports).to.eq(true, 'members exist');
    expect(Object.keys(enumSymbol.exports!)).to.deep.eq(['heart', 'club', 'diamond', 'spade']);
    const enumMembers = mapDict(enumSymbol.exports!, en => t.resolveReference(en));
    const { heart, club, diamond, spade } = filterDict(enumMembers, isDefined);

    expect(heart!.kind).to.eq('enumMember');
    expect(club!.kind).to.eq('enumMember');
    expect(diamond!.kind).to.eq('enumMember');
    expect(spade!.kind).to.eq('enumMember');

    expect(heart!.name).to.eq('heart');
    expect(club!.name).to.eq('club');
    expect(diamond!.name).to.eq('diamond');
    expect(spade!.name).to.eq('spade');

    t.cleanup();
  }

  @test public async 'regular enum member'() {
    const code = `enum Suit { heart, club, diamond, spade }
    export const x = Suit.heart;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    expect(Object.keys(fileExports)).to.deep.eq(['x']);
    const enumMemberSymbol = fileExports.x!;
    expect(enumMemberSymbol.name).to.eq('x');
    const enumType = t.resolveReference(enumMemberSymbol.type);
    expect(enumType.text).to.eq('Suit.heart');

    t.cleanup();
  }

  @test public async 'const enum'() {
    const code = `export const enum Suit { heart, club, diamond, spade }`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    expect(Object.keys(fileExports)).to.deep.eq(['Suit']);
    const enumSymbol = fileExports.Suit!;
    expect(enumSymbol.name).to.eq('Suit');
    expect(enumSymbol.isConst).to.eq(true);
    const enumType = t.resolveReference(enumSymbol.type);
    expect(enumType.text).to.eq('typeof Suit');
    expect(!!enumSymbol.exports).to.eq(true, 'members exist');
    expect(Object.keys(enumSymbol.exports!)).to.deep.eq(['heart', 'club', 'diamond', 'spade']);
    const enumMembers = mapDict(enumSymbol.exports!, en => t.resolveReference(en));
    const { heart, club, diamond, spade } = filterDict(enumMembers, isDefined);

    expect(heart!.kind).to.eq('enumMember');
    expect(club!.kind).to.eq('enumMember');
    expect(diamond!.kind).to.eq('enumMember');
    expect(spade!.kind).to.eq('enumMember');

    expect(heart!.name).to.eq('heart');
    expect(club!.name).to.eq('club');
    expect(diamond!.name).to.eq('diamond');
    expect(spade!.name).to.eq('spade');

    t.cleanup();
  }

  @test public async 'const enum member'() {
    const code = `const enum Suit { heart, club, diamond, spade }
    export const x = Suit.heart;`;
    const t = new SingleFileAcceptanceTestCase(code);
    await t.run();
    const file = t.sourceFile();
    const fileSymbol = t.resolveReference(file.symbol!);
    const fileExports = mapDict(fileSymbol.exports!, e => t.resolveReference(e));
    expect(Object.keys(fileExports)).to.deep.eq(['x']);
    const enumMemberSymbol = fileExports.x!;
    expect(enumMemberSymbol.name).to.eq('x');
    const enumType = t.resolveReference(enumMemberSymbol.type);
    expect(enumType.text).to.eq('Suit.heart');

    t.cleanup();
  }
}
