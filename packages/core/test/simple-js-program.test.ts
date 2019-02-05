import { setupTestCase } from '@code-to-json/test-helpers';
import { createProgramFromCodeString } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import * as path from 'path';
import { getDeclarationFiles } from './test-helpers';

const STANDARD_LIBS = [
  'lib.es5.d.ts',
  'lib.es2015.d.ts',
  'lib.es2016.d.ts',
  'lib.es2017.d.ts',
  'lib.es2018.d.ts',
  'lib.esnext.d.ts',
  'lib.dom.d.ts',
  'lib.dom.iterable.d.ts',
  'lib.webworker.importscripts.d.ts',
  'lib.scripthost.d.ts',
  'lib.es2015.core.d.ts',
  'lib.es2015.collection.d.ts',
  'lib.es2015.generator.d.ts',
  'lib.es2015.iterable.d.ts',
  'lib.es2015.promise.d.ts',
  'lib.es2015.proxy.d.ts',
  'lib.es2015.reflect.d.ts',
  'lib.es2015.symbol.d.ts',
  'lib.es2015.symbol.wellknown.d.ts',
  'lib.es2016.array.include.d.ts',
  'lib.es2017.object.d.ts',
  'lib.es2017.sharedmemory.d.ts',
  'lib.es2017.string.d.ts',
  'lib.es2017.intl.d.ts',
  'lib.es2017.typedarrays.d.ts',
  'lib.es2018.intl.d.ts',
  'lib.es2018.promise.d.ts',
  'lib.es2018.regexp.d.ts',
  'lib.esnext.array.d.ts',
  'lib.esnext.symbol.d.ts',
  'lib.esnext.asynciterable.d.ts',
  'lib.esnext.intl.d.ts',
  'lib.esnext.bigint.d.ts',
  'lib.esnext.full.d.ts',
];

@suite
@slow(800)
export class TypeScriptFixturePrograms {
  @test
  public async 'creation of a simple JS program from fixture files'(): Promise<void> {
    const { program } = await setupTestCase(
      path.join(__dirname, '..', '..', '..', 'samples', 'js-single-file'),
      ['src/index.js'],
    );
    const { tsLibNames, nonDeclarationFiles } = getDeclarationFiles(program.getSourceFiles());

    expect(tsLibNames).to.include.deep.members(STANDARD_LIBS);

    expect(nonDeclarationFiles).to.be.lengthOf(1);

    expect(nonDeclarationFiles[0].fileName)
      .to.contain('src')
      .to.contain('index.js');
  }

  @test
  public async 'creation of a simple JS program from fixture object'(): Promise<void> {
    const { program } = await setupTestCase(
      {
        'tsconfig.json': `{
    "extends": "../tsconfig.json",
    "compilerOptions": {
      "experimentalDecorators": true,
      "noEmit": true
    },
    "include": ["**/*.test.ts", "../src/**/*.ts"]
  }
`,
        "src": {
          'index.js': `import { readdirSync } from 'fs';

/**
 * @module js-single-file
 */

/**
 * Add two numbers
 * @param {number} a
 * @param {number} b
 */
export function add(a, b) {
  return a + b;
}

export const SECRET_STRING = 'shhhhh!';

/**
 * A vehicle is a thing that goes places
 */
class Vehicle {
  /**
   * Create a new vehicle
   * @param {number} numWheels Number of wheels
   */
  constructor(numWheels) {
    this.numWheels = numWheels;
  }
  /**
   * Drive the vehicle
   * @returns {string}
   */
  drive() {
    return \`Driving with all \${this.numWheels} wheels\`;
  }
}

/**
 * A car is a 4-wheeled vehicle
 */
export class Car extends Vehicle {
  /**
   * Create a new car
   */
  constructor() {
    super(4);
  }
}

/**
 * A bike is a 2-wheeled vehicle
 */
export class Bike extends Vehicle {
  constructor() {
    super(2);
  }
}

/**
 * A Unicycle is a 1-wheeled vehicle
 */
export class Unicycle extends Vehicle {
  constructor() {
    super(1);
  }
}
`,
        },
      },
      ['src/index.js'],
    );
    const { tsLibNames, nonDeclarationFiles } = getDeclarationFiles(program.getSourceFiles());

    expect(tsLibNames).to.deep.include.members(STANDARD_LIBS);

    expect(nonDeclarationFiles).to.be.lengthOf(1);

    expect(nonDeclarationFiles[0].fileName)
      .to.contain('src')
      .to.contain('index.js');
  }

  @test
  public async 'creation of a simple TS program from string'(): Promise<void> {
    const { program } = createProgramFromCodeString("export const x: string = 'foo';", 'ts');
    const { tsLibNames, nonDeclarationFiles } = getDeclarationFiles(program.getSourceFiles());

    expect(tsLibNames).to.deep.eq([]);

    expect(nonDeclarationFiles).to.be.lengthOf(1);

    expect(nonDeclarationFiles[0].fileName)
      .and.to.contain('module.ts')
      .but.not.contain('src');
  }
}
