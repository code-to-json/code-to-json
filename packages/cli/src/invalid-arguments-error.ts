export default class InvalidArgumentsError extends Error {
  // tslint:disable-next-line:variable-name
  public readonly __invalid_arguments_error = true;
  constructor(message: string) {
    super(message);
  }
}
