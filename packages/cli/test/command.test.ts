import { createTempFixtureFolder, TestCaseFolder } from '@code-to-json/test-helpers';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import generateJSONCommand from '../src/commands/generate-json';

async function makeWorkspace(): Promise<TestCaseFolder> {
  const workspace = await createTempFixtureFolder({
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
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
export class CommandTests {
  @test
  public async 'run command: --project'(): Promise<void> {
    const workspace = await makeWorkspace();
    await generateJSONCommand({
      project: workspace.rootPath,
      out: workspace.rootPath,
      format: 'formatted',
    });
    expect(workspace.toString()).to.eql(
      `├─ formatted.json
├─ src
│  ├─ index.ts
│  ├─ more.js
│  └─ other.ts
└─ tsconfig.json
`,
    );
    workspace.cleanup();
  }

  @test.skip
  public async 'run command: entries'(): Promise<void> {
    const workspace = await makeWorkspace();
    await generateJSONCommand({ out: path.join(workspace.rootPath, 'out') }, ['src/index.ts']);
    expect(workspace.toString()).to.eql(
      `├─ out
│  └─ formatted.json
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
      await generateJSONCommand({ out: path.join(workspace.rootPath, 'out') }).then(() => {
        expect(false).to.eql(true);
      });
    } catch (err) {
      expect(err.message).to.contain('Either --project <path> or entries glob(s) must be defined');
    }

    workspace.cleanup();
  }
}
