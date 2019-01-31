// @flow

// import type { PathType } from './types.flow';
import * as bTypes from '@babel/types';
import Type from './entities/Type';
import type { PathType } from './types.flow';
import expressionJSON from '../assets/temp.json';

// ArrayExpression: ({ elements }) => bTypes.TupleTypeAnnotation(elements.map(getFlowType)),

const expressions = ['UnaryExpression', 'UpdateExpression'];
const complexExpressions = ['ArrayExpression'];
const typeHasValue = (type: string): boolean => type.includes('Literal') && type !== 'NullLiteral';

export default (node): Type => {
  if (node === null) {
    return new Type('Void');
  }

  const { type } = node;
  if (expressions.includes(type)) {
    const { operator } = node;
    return new Type(expressionJSON[operator]);
  }
  if (complexExpressions.includes(type)) {
    console.log(type);
    return new Type('Void');
  }
  if (typeHasValue(type)) {
    const { value } = node;
    return new Type(type, value);
  }

  return new Type(type);
};
