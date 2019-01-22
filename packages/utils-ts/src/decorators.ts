import * as ts from 'typescript';

export function decoratorsToStrings(decorators: ts.NodeArray<ts.Decorator>): string[] {
  return decorators.map(d => d.expression.getText());
}
