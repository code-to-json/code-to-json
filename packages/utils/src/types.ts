export type ErrorResult<E extends Error = Error> = ['error', E];
export type SuccessResult<T> = ['ok', T];
export type Result<T, E extends Error = Error> = SuccessResult<T> | ErrorResult<E>;
export type TextFileReader = (name: string) => string;
export type FileExistenceChecker = (name: string) => boolean;
