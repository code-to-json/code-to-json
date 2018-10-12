import { Result } from './types';
interface Config {
    projectPath: string;
}
export declare class ValidationError extends Error {
    private feedback;
    constructor(message: string, feedback: ValidationFeedback);
    toString(): string;
}
declare type ValidationFeedback = {
    [k: string]: string[];
};
export declare function validateConfig(rawOptions: {
    [k: string]: string;
}): Result<Config, ValidationError>;
export {};
//# sourceMappingURL=config.d.ts.map