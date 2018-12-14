import { suite, test } from 'mocha-typescript';
import * as snapshot from 'snap-shot-it';
import { isBlank, isEmpty, isNone, isPresent } from '../src/checks';

@suite('Simple predicates')
class SimpleChecks {
  @test
  public 'isEmpty tests'() {
    snapshot({ result: isEmpty(0) });
    snapshot({ result: isEmpty(null) });
    snapshot({ result: isEmpty([]) });
    snapshot({ result: isEmpty({ size: 0 }) });
    snapshot({ result: isEmpty({ size: 33 }) });
    snapshot({ result: isEmpty({ length: 0 }) });
    snapshot({ result: isEmpty({ length: 33 }) });
    snapshot({ result: isEmpty(() => ({})) });
    snapshot({ result: isEmpty(new Map([['a', 1]])) });
  }
  @test
  public 'isNone tests'() {
    snapshot({ result: isNone(0) });
    snapshot({ result: isNone(null) });
    snapshot({ result: isNone([]) });
    snapshot({ result: isNone({ size: 0 }) });
    snapshot({ result: isNone({ size: 33 }) });
    snapshot({ result: isNone({ length: 0 }) });
    snapshot({ result: isNone({ length: 33 }) });
    snapshot({ result: isNone(() => ({})) });
    snapshot({ result: isNone(new Map([['a', 1]])) });
  }
  @test
  public 'isBlank tests'() {
    snapshot({ result: isBlank(0) });
    snapshot({ result: isBlank(null) });
    snapshot({ result: isBlank([]) });
    snapshot({ result: isBlank({ size: 0 }) });
    snapshot({ result: isBlank({ size: 33 }) });
    snapshot({ result: isBlank({ length: 0 }) });
    snapshot({ result: isBlank({ length: 33 }) });
    snapshot({ result: isBlank(() => ({})) });
    snapshot({ result: isBlank(new Map([['a', 1]])) });
  }
  @test
  public 'isPresent tests'() {
    snapshot({ result: isPresent(0) });
    snapshot({ result: isPresent(null) });
    snapshot({ result: isPresent([]) });
    snapshot({ result: isPresent({ size: 0 }) });
    snapshot({ result: isPresent({ size: 33 }) });
    snapshot({ result: isPresent({ length: 0 }) });
    snapshot({ result: isPresent({ length: 33 }) });
    snapshot({ result: isPresent(() => ({})) });
    snapshot({ result: isPresent(new Map([['a', 1]])) });
  }
}
