// @flow

// import type { PathType } from './types.flow';
import * as bTypes from '@babel/types';

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

// type Annotation = {| type: string, value?: mixed, types?: mixed |};
// a is subtype of b => true, else false
const isSubtype = (a, b): boolean => {
  if (b.type === 'AnyTypeAnnotation') {
    return true;
  }
  if (a.type === 'AnyTypeAnnotation') {
    return false;
  }
  if (a.type === 'ArrayTypeAnnotation') {
    return false;
  }
  if (a.type === 'TupleTypeAnnotation' && b.type === 'TupleTypeAnnotation') {
    return a.types.every((item, ind) => isSubtype(item, b.types[ind]));
  }
  if (a.type === 'TupleTypeAnnotation' || b.type === 'TupleTypeAnnotation') {
    return false;
  }
  if (a.type === b.type && a.value === b.value) {
    return true;
  }

  const primitiveLevelSuperiors = {
    StringTypeAnnotation: ['AnyTypeAnnotation'],
    NumberTypeAnnotation: ['AnyTypeAnnotation'],
    BooleanTypeAnnotation: ['AnyTypeAnnotation'],
    VoidTypeAnnotation: ['AnyTypeAnnotation'],
  };

  const literalLevelSuperiors = {
    StringLiteralTypeAnnotation: [
      'StringTypeAnnotation',
      ...primitiveLevelSuperiors.StringTypeAnnotation,
    ],
    NumberLiteralTypeAnnotation: [
      'NumberTypeAnnotation',
      ...primitiveLevelSuperiors.NumberTypeAnnotation,
    ],
    BooleanLiteralTypeAnnotation: [
      'BooleanTypeAnnotation',
      ...primitiveLevelSuperiors.BooleanTypeAnnotation,
    ],
    NullLiteralTypeAnnotation: ['AnyTypeAnnotation'],
  };

  const allSuperiors = { ...primitiveLevelSuperiors, ...literalLevelSuperiors };
  const superiors = allSuperiors[a.type];

  if (!superiors) {
    console.warn(`unknown type ${a.type}`);
    return false;
  }

  return superiors.includes(b.type);
};

const typeDegree = (node: *) => {
  const { type } = node;

  const degrees = {
    AnyTypeAnnotation: 0,
    ArrayTypeAnnotation: 1,
    TupleTypeAnnotation: 2,
    StringTypeAnnotation: 2,
    NumberTypeAnnotation: 2,
    BooleanTypeAnnotation: 2,
    VoidTypeAnnotation: 2,
    StringLiteralTypeAnnotation: 3,
    NumberLiteralTypeAnnotation: 3,
    BooleanLiteralTypeAnnotation: 3,
    NullLiteralTypeAnnotation: 3,
  };

  return degrees[type];
};

export const resolveTypes = (types: Array<any>) => {
  const sortedTypes = [...types].sort((a, b) => typeDegree(b) - typeDegree(a));
  const res = sortedTypes.filter((item, ind) => {
    const leftTypes = sortedTypes.slice(ind + 1);
    return !leftTypes.some(possibleSuperior => isSubtype(item, possibleSuperior));
  });

  return res;
};
