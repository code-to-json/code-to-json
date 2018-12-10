import { suite, test } from 'mocha-typescript';
import * as snapshot from 'snap-shot-it';
import * as path from 'path';
import { setupTestCase } from '@code-to-json/test-helpers';

function add(x: number, y: number) { return x + y; }

@suite
class Two {
  @test
  // tslint:disable-next-line:typedef
  public async method() {
    const { program } = await setupTestCase( path.join(__dirname, '..', '..', 'samples','js-single-file'));
    console.log(program);
    snapshot(add(103, 20));
    snapshot('a text message');
    return Promise.resolve(42).then(snapshot);
  }
}
