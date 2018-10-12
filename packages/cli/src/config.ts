import { Result } from './types';
import { isEmpty, isDirectoryThatExists } from './validators';
import * as path from 'path';

interface Config {
  projectPath: string;
}

export class ValidationError extends Error {
  constructor(message: string, private feedback: ValidationFeedback) {
    super(message + `\n${JSON.stringify(feedback)}`);
  }
  toString() {
    return `${super.toString()}
${Object.keys(this.feedback)
      .map(f => {
        return `  ${f.toUpperCase()}
   ${this.feedback[f].join('\n')}
`;
      })
      .join('')}`;
  }
}

type ValidationFeedback = { [k: string]: string[] };

function validateProjectPath(rawPath: any, errors: ValidationFeedback) {
  const pathErrors = [];
  if (typeof rawPath !== 'string') {
    pathErrors.push('path must be a string');
  }
  if (isEmpty(rawPath)) {
    pathErrors.push('path must not be empty');
  }
  if (isDirectoryThatExists(path.join(process.cwd(), rawPath))) {
    console.error('----', path.join(process.cwd(), rawPath));
    pathErrors.push('path must point to a folder that exists');
  }
  if (pathErrors.length > 0) {
    errors.path = pathErrors;
  }
}

export function validateConfig(rawOptions: {
  [k: string]: string;
}): Result<Config, ValidationError> {
  const validationErrors: ValidationFeedback = {};
  const projPath = rawOptions.project;
  validateProjectPath(projPath, validationErrors);
  if (Object.keys(validationErrors).length === 0) {
    return ['ok', { projectPath: projPath }];
  } else {
    return [
      'error',
      new ValidationError('configuration is invalid', validationErrors)
    ];
  }
}
