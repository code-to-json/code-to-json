import { expect } from 'chai';
import * as fs from 'fs';
import { describe, it } from 'mocha';
import * as path from 'path';
import * as tmp from 'tmp';
import { asString } from '../src/dir-tree';

describe('DirTree tests', () => {
  it('empty folder', async () => {
    const workspace = tmp.dirSync({ unsafeCleanup: true });
    expect(workspace.name.length).to.be.greaterThan(0, 'Temp folder path is a non-empty string');
    const newFolder = path.join(workspace.name, 'new-folder');
    fs.mkdirSync(newFolder);
    expect(asString(newFolder)).to.eq('(empty)');
    workspace.removeCallback();
  });

  it('folder with a file', async () => {
    const workspace = tmp.dirSync({ unsafeCleanup: true });
    expect(workspace.name.length).to.be.greaterThan(0, 'Temp folder path is a non-empty string');
    const newFolder = path.join(workspace.name, 'new-folder');
    fs.mkdirSync(newFolder);
    fs.writeFileSync(path.join(newFolder, 'file.txt'), 'Hello, world!');
    expect(asString(newFolder).trim()).to.eq('└─ file.txt');
    workspace.removeCallback();
  });
});
