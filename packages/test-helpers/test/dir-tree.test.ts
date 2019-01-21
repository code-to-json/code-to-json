import { expect } from 'chai';
import * as fs from 'fs';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import * as tmp from 'tmp';
import { asString } from '../src/dir-tree';

@suite
export class DirTreeTests {
  @test
  public async 'empty folder'(): Promise<void> {
    const workspace = tmp.dirSync({ unsafeCleanup: true });
    expect(workspace.name.length).to.be.greaterThan(0, 'Temp folder path is a non-empty string');
    const newFolder = path.join(workspace.name, 'new-folder');
    fs.mkdirSync(newFolder);
    expect(asString(newFolder)).to.eq('(empty)');
    workspace.removeCallback();
  }

  @test
  public async 'folder with a file'(): Promise<void> {
    const workspace = tmp.dirSync({ unsafeCleanup: true });
    expect(workspace.name.length).to.be.greaterThan(0, 'Temp folder path is a non-empty string');
    const newFolder = path.join(workspace.name, 'new-folder');
    fs.mkdirSync(newFolder);
    fs.writeFileSync(path.join(newFolder, 'file.txt'), 'Hello, world!');
    expect(asString(newFolder).trim()).to.eq('└─ file.txt');
    workspace.removeCallback();
  }
}
