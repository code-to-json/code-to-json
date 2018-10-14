import { Result } from './types';
import { isEmpty, ValidationFeedback, isFileThatExists } from './validators';
import * as path from 'path';
import ValidationError from './errors/validation';
import { isHomogenousArray } from '@code-to-json/core';

interface Config {
  entries: string[];
  configPath?: string;
}

export function validateEntries(entries: any): entries is string[] {
  return isHomogenousArray<string>(
    entries,
    (e): e is string => typeof e === 'string'
  );
}

function isExistingFilePath(rawPath: any, errors: ValidationFeedback) {
  const pathErrors = [];
  if (typeof rawPath !== 'string') {
    pathErrors.push('path must be a string');
  }
  if (isEmpty(rawPath)) {
    pathErrors.push('path must not be empty');
  }
  if (isFileThatExists(path.join(process.cwd(), rawPath))) {
    console.error('----', path.join(process.cwd(), rawPath));
    pathErrors.push('path must point to a folder that exists');
  }
  if (pathErrors.length > 0) {
    errors.path = pathErrors;
  }
}

export function validateConfig(rawOptions: {
  [k: string]: string | string[];
}): Result<Config, ValidationError> {
  const validationErrors: ValidationFeedback = {};
  const configPath = rawOptions.config;
  const entries = rawOptions.entries;
  if (!validateEntries(entries)) {
    validationErrors.entries = ['Invalid entries'];
  }
  if (typeof configPath === 'string') {
    isExistingFilePath(configPath, validationErrors);
  }
  if (Object.keys(validationErrors).length === 0) {
    return ['ok', { entries: entries as string[], configPath } as Config];
  } else {
    return [
      'error',
      new ValidationError('configuration is invalid', validationErrors)
    ];
  }
}
