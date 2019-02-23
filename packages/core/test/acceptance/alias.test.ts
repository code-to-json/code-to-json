import { mapDict } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { MultiFileAcceptanceTestCase } from './helpers/test-case';

describe('alias acceptance tests', () => {
  it('alias symbol points to correct thing', async () => {
    const t = new MultiFileAcceptanceTestCase({
      'foo.ts': 'export class Vehicle { numWheels: number = 4; drive() { return "vroom";} }',
      'index.ts': 'export { Vehicle } from "./foo";\nexport const abc = "def";',
    });
    await t.run();
    const files = t.sourceFiles();
    const fileSymbols = files.map(file => t.resolveReference(file.symbol));
    expect(fileSymbols.length).to.eq(2);
    const [fooFile, indexFile] = fileSymbols;
    expect(indexFile.name).to.contain('index');
    expect(fooFile.name).to.contain('foo');

    const fooExports = mapDict(fooFile.exports!, exp => t.resolveReference(exp));
    const indexExports = mapDict(indexFile.exports!, exp => t.resolveReference(exp));

    expect(Object.keys(fooExports).length).to.eql(1, 'one export from foo.ts');
    expect(Object.keys(indexExports).length).to.eql(2, 'two exports from index.ts');

    const { Vehicle: vehicle } = fooExports;
    const { Vehicle: aliasVehicle } = indexExports;

    if (!vehicle) throw new Error('vehicle not found');
    if (!aliasVehicle) throw new Error('aliasVehicle not found');

    expect(vehicle.flags).to.deep.include('Class');
    expect(aliasVehicle.flags).to.deep.include('Alias');

    expect(!!aliasVehicle.aliasedSymbol).to.eq(true);
    expect(t.resolveReference(aliasVehicle.aliasedSymbol).id).to.eq(vehicle.id);

    t.cleanup();
  });
}).slow(1500);
