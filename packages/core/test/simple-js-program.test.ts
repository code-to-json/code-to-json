import { setupTestCase } from '@code-to-json/test-helpers';
import { createProgramFromCodeString } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { slow, suite, test } from 'mocha-typescript';
import * as path from 'path';
import { getDeclarationFiles } from './test-helpers';

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

    expect(tsLibNames).to.deep.eq([
      'lib.d.ts',
      'lib.es5.d.ts',
      'lib.dom.d.ts',
      'lib.webworker.importscripts.d.ts',
      'lib.scripthost.d.ts',
    ]);

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
        src: {
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

    expect(tsLibNames).to.deep.eq([
      'lib.d.ts',
      'lib.es5.d.ts',
      'lib.dom.d.ts',
      'lib.webworker.importscripts.d.ts',
      'lib.scripthost.d.ts',
    ]);

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
