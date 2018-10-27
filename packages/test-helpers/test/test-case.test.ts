import { suite, test } from 'mocha-typescript';
import * as snapshot from 'snap-shot-it';

@suite
class TestCaseCreation {
  @test
  public 'Create a new test case from a template'() {
    return Promise.resolve({ val: 42}).then(snapshot);
  }
}
