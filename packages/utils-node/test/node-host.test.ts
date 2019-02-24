import { expect } from 'chai';
import { existsSync, mkdirSync, readFileSync, rmdirSync, unlinkSync } from 'fs';
import { describe, it } from 'mocha';
import { join } from 'path';
import nodeHost from '../src/node-host';

describe('Node host tests', () => {
  it('expected methods exist', () => {
    expect(Object.keys(nodeHost)).to.deep.eq([
      'readFileSync',
      'writeFileSync',
      'fileOrFolderExists',
      'isFile',
      'isFolder',
      'pathRelativeTo',
      'combinePaths',
      'normalizePath',
      'createFolder',
      'removeFolderAndContents',
      'createTempFolder',
    ]);
  });

  it('readFileSync tests', () => {
    expect(nodeHost.readFileSync(join(__dirname, 'mocha.opts'))).contains('ts-node/register');
  });

  it('writeFileSync tests', () => {
    const p = join(__dirname, 'foo.txt');
    nodeHost.writeFileSync(p, 'hello world');
    expect(readFileSync(p).toString()).to.eq('hello world');
    unlinkSync(p);
  });

  it('fileOrFolderExists tests', () => {
    expect(nodeHost.fileOrFolderExists(join(__dirname, '..'))).to.eq(true);
    expect(nodeHost.fileOrFolderExists(join(__dirname, '..', 'README.md'))).to.eq(true);
    expect(nodeHost.fileOrFolderExists(join(__dirname, '..', 'DO_NOT_README.md'))).to.eq(false);
  });

  it('isFile tests', () => {
    expect(nodeHost.isFile(join(__dirname, '..'))).to.eq(false);
    expect(nodeHost.isFile(join(__dirname, '..', 'README.md'))).to.eq(true);
  });

  it('isFolder tests', () => {
    expect(nodeHost.isFolder(join(__dirname, '..'))).to.eq(true);
    expect(nodeHost.isFolder(join(__dirname, '..', 'README.md'))).to.eq(false);
  });

  it('pathRelativeTo tests', () => {
    expect(
      nodeHost.pathRelativeTo(__dirname, join(__dirname, '..', 'README.md')).replace(/[\\/]+/g, ''),
    ).to.eq('..README.md');
  });

  it('combinePaths tests', () => {
    expect(nodeHost.combinePaths('foo/bar', 'baz').replace(/[\\/]+/g, '')).to.eq('foobarbaz');
    expect(nodeHost.combinePaths('foo/bar', 'baz', '..').replace(/[\\/]+/g, '')).to.eq('foobar');
  });

  it('normalizePath tests', () => {
    expect(nodeHost.normalizePath('foo/bar/./baz')).to.eq('foo/bar/baz');
  });

  it('createFolder tests', () => {
    const p = join(__dirname, 'tempfolder');
    expect(existsSync(p)).to.eq(false);
    nodeHost.createFolder(p);
    expect(existsSync(p)).to.eq(true);
    rmdirSync(p);
  });

  it('removeFolderAndContents tests', async () => {
    const p = join(__dirname, 'tempfolder2');
    expect(existsSync(p)).to.eq(false);
    mkdirSync(p);
    expect(existsSync(p)).to.eq(true);
    await nodeHost.removeFolderAndContents(p);
    expect(existsSync(p)).to.eq(false);
  });

  it('createTempFolder tests', () => {
    const { name, cleanup } = nodeHost.createTempFolder();
    expect(name).to.be.a('string');
    expect(existsSync(name)).to.eq(true);
    cleanup();
    expect(existsSync(name)).to.eq(false);
  });
});
