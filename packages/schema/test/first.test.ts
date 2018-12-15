import { suite, test } from 'mocha-typescript';
import * as snapshot from 'snap-shot-it';

function add(x: number, y: number): number {
  return x + y;
}

@suite
class Two {
  @test
  // tslint:disable-next-line:typedef
  public method(): Promise<void> {
    snapshot(add(103, 20));
    snapshot('a text message');
    return Promise.resolve(42).then(snapshot);
  }
}
