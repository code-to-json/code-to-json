import BaseError from './base';

/**
 * Throw an error describing invalid arguments passed to the CLI
 */
export default class InvalidArgumentsError extends BaseError<'invalidArguments'> {
  /**
   * Invalid arguments brand
   */
  public readonly kind = 'invalidArguments';
  constructor(msg: string) {
    super(`[Invalid arguments] ${msg}`);
  }
}
