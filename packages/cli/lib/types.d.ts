export declare type ErrorResult<E extends Error = Error> = ['error', E];
export declare type SuccessResult<T> = ['ok', T];
export declare type Result<T, E extends Error = Error> = SuccessResult<T> | ErrorResult<E>;
//# sourceMappingURL=types.d.ts.map