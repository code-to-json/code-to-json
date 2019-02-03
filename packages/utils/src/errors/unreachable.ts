import BaseError from './base';

const BASE_MESSAGE = 'Reached code that should be unreachable';

/**
 * Build an error message string that starts with `BASE_MESSAGE`
 * @param message error message suffix
 */
function createMessage(message?: string): string {
  const a: string[] = [BASE_MESSAGE];
  if (message) {
    a.push(message);
  }
  return a.join('\n');
}

/**
 * An error that's associated with un-reachable code
 *
 * @public
 */
class UnreachableError extends BaseError<'unreachable'> {
  public readonly kind = 'unreachable';
  constructor(_arg: never, message?: string) {
    super(createMessage(message));
  }
}

export default UnreachableError;
