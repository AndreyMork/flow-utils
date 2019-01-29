// @flow

import type { PathType } from './types.flow';

const bTypes = require('@babel/types');
// const traverse = require('@babel/traverse').default;
// const { printCodeSeg } = require('./utils');

const getFlowType = (node) => {
  const { type } = node;

  const types = {
    StringLiteral: ({ value }) => bTypes.StringLiteralTypeAnnotation(value),
    TemplateLiteral: () => bTypes.StringTypeAnnotation(),
    NumericLiteral: ({ value }) => bTypes.NumberLiteralTypeAnnotation(value),
    BooleanLiteral: ({ value }) => bTypes.BooleanLiteralTypeAnnotation(value),
    NullLiteral: () => bTypes.nullLiteralTypeAnnotation(),
    ArrayExpression: ({ elements }) => bTypes.TupleTypeAnnotation(elements.map(getFlowType)),
  };

  const anyType = () => bTypes.anyTypeAnnotation();
  const buildType = types[type] || anyType;
  return buildType(node);
};

type Annotation = {| type: string, value?: mixed |};
// a is subtype of b => true, else false
const isSubtype = (a: Annotation, b: Annotation): boolean => {
  if (b.type === 'AnyTypeAnnotation') {
    return true;
  }
  if (a.type === 'AnyTypeAnnotation') {
    return false;
  }
  if (a.type === 'TupleTypeAnnotation') {
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
    NullLiteralTypeAnnotation: [
      'VoidTypeAnnotation',
      ...primitiveLevelSuperiors.VoidTypeAnnotation,
    ],
  };

  const allSuperiors = { ...primitiveLevelSuperiors, ...literalLevelSuperiors };
  const superiors = allSuperiors[a.type];

  return superiors.includes(b.type);
};

const resolveTypes = (types) => {
  const sortedTypes = [...types].sort((a, b) => (isSubtype(a, b) ? -1 : 1));
  const res = sortedTypes.filter((item, ind) => {
    const leftTypes = sortedTypes.slice(ind + 1);
    return !leftTypes.some(possibleSuperior => isSubtype(item, possibleSuperior));
  });

  return res;
};

const getReturnStatements = (path: PathType): Array<PathType> => {
  const returnStatements = [];
  path.traverse({
    ReturnStatement(innerPath) {
      returnStatements.push(innerPath);
    },
  });

  return returnStatements;
};

const getTypeAnnotation = (returnStatements: Array<PathType>) => {
  if (returnStatements.length === 0) {
    return bTypes.typeAnnotation(bTypes.voidTypeAnnotation());
  }

  const typeAnnotations = returnStatements.map(({ node }) => {
    if (!node.argument) {
      return bTypes.voidTypeAnnotation();
    }

    const typeAnnotation = getFlowType(node.argument);
    return typeAnnotation;
  });

  if (typeAnnotations.length === 1) {
    return bTypes.typeAnnotation(typeAnnotations[0]);
  }

  const resolvedTypes = resolveTypes(typeAnnotations);
  const unionTypes = bTypes.UnionTypeAnnotation(resolvedTypes);
  return bTypes.typeAnnotation(unionTypes);
};

module.exports.default = {
  'FunctionDeclaration|FunctionExpression': (path: PathType) => {
    const returnStatements = getReturnStatements(path);
    const typeAnnotation = getTypeAnnotation(returnStatements);
    path.get('returnType').replaceWith(typeAnnotation);
  },
  ArrowFunctionExpression(path: PathType) {
    if (!path.get('body').isBlockStatement()) {
      const { body } = path.node;
      const returnTypeAnnotation = bTypes.typeAnnotation(getFlowType(body));
      path.get('returnType').replaceWith(returnTypeAnnotation);
      return;
    }

    const returnStatements = getReturnStatements(path);
    const typeAnnotation = getTypeAnnotation(returnStatements);
    path.get('returnType').replaceWith(typeAnnotation);
  },
};
