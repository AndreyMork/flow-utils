// @flow

// import type { PathType } from './types.flow';
import * as bTypes from '@babel/types';
import Type from './entities/Type';
import LiteralType from './entities/LiteralType';
import type { PathType } from './types.flow';
import expressionJSON from '../assets/temp.json';

// ArrayExpression: ({ elements }) => bTypes.TupleTypeAnnotation(elements.map(getFlowType)),

const expressions = ['UnaryExpression', 'UpdateExpression'];
const complexExpressions = ['ArrayExpression'];
const typeHasValue = (type: string): boolean => type.includes('Literal') && type !== 'NullLiteral' && type !== 'TemplateLiteral';

export default (node): Type => {
  if (node === null || node === undefined) {
    return new Type('Void');
  }

  const { type } = node;
  if (expressions.includes(type)) {
    const { operator } = node;
    return new Type(expressionJSON[operator]);
  }
  if (typeHasValue(type)) {
    const { value } = node;
    return new LiteralType(type, value);
  }

  return new Type(type);
};
