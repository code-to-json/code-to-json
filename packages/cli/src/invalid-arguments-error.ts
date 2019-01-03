/**
 * Throw an error describing invalid arguments passed to the CLI
 */
export default class InvalidArgumentsError extends Error {
  /**
   * Invalid arguments brand
   */
  // tslint:disable-next-line:variable-name
  public readonly __invalid_arguments_error = true;

  constructor(msg: string) {
    super(`[Invalid arguments] ${msg}`);
  }
}
