// tslint:disable:no-duplicate-string
import { createTempFixtureFolder, TestCaseFolder } from '@code-to-json/test-helpers';
import { expect } from 'chai';
import * as fs from 'fs';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import {
  createProgramFromEntries,
  createProgramFromTsConfig,
  globsToPaths,
  tsConfigForPath,
} from '../src/command-utils';
import run from '../src/commands/run';

async function makeWorkspace(): Promise<TestCaseFolder> {
  const workspace = await createTempFixtureFolder({
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        allowJs: true,
        checkJs: true,
        target: 'ES2017',
        noEmit: true,
      },
    }),
    src: {
      'index.ts': "const x: string = 'foo';",
      'other.ts': "const y: string = 'bar';",
      'more.js': "const z = 'baz';",
    },
  });
  return workspace;
}

@suite
class CommandTests {
  @test
  public async 'run command: --project'(): Promise<void> {
    const workspace = await makeWorkspace();
    await run({ project: workspace.rootPath, out: workspace.rootPath });
    expect(workspace.toString()).to.eql(
      `├─ formatted.json
├─ raw.json
├─ src
│  ├─ index.ts
│  ├─ more.js
│  └─ other.ts
└─ tsconfig.json
`,
    );
    workspace.cleanup();
  }

  @test
  public async 'run command: entries'(): Promise<void> {
    const workspace = await makeWorkspace();
    await run({ out: path.join(workspace.rootPath, 'out') }, ['src/index.ts']);
    expect(workspace.toString()).to.eql(
      `├─ out
│  ├─ formatted.json
│  └─ raw.json
├─ src
│  ├─ index.ts
│  ├─ more.js
│  └─ other.ts
└─ tsconfig.json
`,
    );
    workspace.cleanup();
  }

  @test
  public async 'run command: insufficient CLI args'(): Promise<void> {
    const workspace = await makeWorkspace();
    try {
      await run({ out: path.join(workspace.rootPath, 'out') }).then(() => {
        expect(false).to.eql(true);
      });
    } catch (err) {
      expect(err.message).to.contain('Either --project <path> or entries glob(s) must be defined');
    }

    workspace.cleanup();
  }
}
