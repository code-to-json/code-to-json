export type ErrorResult<E extends Error = Error> = ['error', E];
export type SuccessResult<T> = ['ok', T];
export type Result<T, E extends Error = Error> =
  | SuccessResult<T>
  | ErrorResult<E>;

export type Flags = string | string[];
