// @flow

// import type { PathType } from './types.flow';
import * as bTypes from '@babel/types';
import Type from './entities/Type';

const getUnaryOperatorType = (operator) => {
  const operatorTypes = {
    '+': bTypes.NumberTypeAnnotation(),
    '-': bTypes.NumberTypeAnnotation(),
    '!': bTypes.BooleanTypeAnnotation(),
    '~': bTypes.BooleanTypeAnnotation(),
    typeof: bTypes.StringTypeAnnotation(),
    void: bTypes.VoidTypeAnnotation(),
    '++': bTypes.NumberTypeAnnotation(),
    '--': bTypes.NumberTypeAnnotation(),
  };
  return operatorTypes[operator];
};

export const getFlowType = (node: *) => {
  const { type } = node;

  const types = {
    StringLiteral: ({ value }) => bTypes.StringLiteralTypeAnnotation(value),
    TemplateLiteral: () => bTypes.StringTypeAnnotation(),
    NumericLiteral: ({ value }) => bTypes.NumberLiteralTypeAnnotation(value),
    BooleanLiteral: ({ value }) => bTypes.BooleanLiteralTypeAnnotation(value),
    NullLiteral: () => bTypes.NullLiteralTypeAnnotation(),
    ArrayExpression: ({ elements }) => bTypes.TupleTypeAnnotation(elements.map(getFlowType)),
    UnaryExpression: ({ operator }) => getUnaryOperatorType(operator),
    UpdateExpression: ({ operator }) => getUnaryOperatorType(operator),
  };

  const anyType = () => bTypes.AnyTypeAnnotation();
  const buildType = types[type] || anyType;
  return buildType(node);
};

export const resolveTypes = (types: Array<any>) => {
  const mappedTypes = types.map(item => new Type(item));

  return Type.resolveTypes(mappedTypes).map(item => item.node);
};
