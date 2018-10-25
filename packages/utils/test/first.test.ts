import { suite, test } from 'mocha-typescript';
import * as snapshot from 'snap-shot-it';
import { isEmpty } from '../src/checks';


@suite
class Two {
  @test
  public method() {
    snapshot({ result: isEmpty(0)});
  }
}
