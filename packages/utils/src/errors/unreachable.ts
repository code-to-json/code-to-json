const BASE_MESSAGE = 'Reached a case that should be unreachable';

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
 */
export class UnreachableError extends Error {
  constructor(_arg: never, message?: string) {
    super(createMessage(message));
  }
}
