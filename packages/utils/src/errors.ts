const BASE_MESSAGE = 'Reached a case that should be unreachable';

function createMessage(message?: string): string {
  let a: string[] = [BASE_MESSAGE];
  if (message) a.push(message);
  return a.join('\n');
}

export class UnreachableError extends Error {
  constructor(arg: never, message?: string) {
    super(createMessage(message));
  }
}
