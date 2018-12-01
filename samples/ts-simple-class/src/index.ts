import add from 'other';

export const abc = 'abc';

export const def = add(3, 4);
/**
 * A Bar example class
 * @example
 * ```ts
 * let bar = new Bar();
 * ```
 *
 * ## Do a thing
 * * first
 * * second
 * * third
 * @see Foo
 */
abstract class Bar {
  private baz = 'this is the value of baz';
  public abc(): number {
    return 6;
  }
  protected abstract bar(): Promise<void>;
}

/**
 * A Foo example class
 */
// tslint:disable-next-line:max-classes-per-file
export class Foo extends Bar {
  protected bar(): Promise<void> {
    return Promise.resolve();
  }
}
