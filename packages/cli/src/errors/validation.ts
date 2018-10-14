import { ValidationFeedback } from '../validators';

export default class ValidationError extends Error {
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
