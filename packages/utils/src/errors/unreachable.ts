const BASE_MESSAGE = 'Reached a case that should be unreachable';

function createMessage(message?: string): string {
  const a: string[] = [BASE_MESSAGE];
  if (message) {
    a.push(message);
  }
  return a.join('\n');
}

export default class UnreachableError extends Error {
  constructor(_arg: never, message?: string) {
    super(createMessage(message));
  }
}
