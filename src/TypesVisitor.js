// @flow

import type { PathType } from './types.flow';

const bTypes = require('@babel/types');
// const traverse = require('@babel/traverse').default;
// const { printCodeSeg } = require('./utils');


const getFlowType = (nodeType: string, value: mixed) => {
  const types = {
    StringLiteral: val => bTypes.StringLiteralTypeAnnotation(val),
    TemplateLiteral: () => bTypes.StringTypeAnnotation(),
    NumericLiteral: val => bTypes.NumberLiteralTypeAnnotation(val),
    BooleanLiteral: val => bTypes.BooleanLiteralTypeAnnotation(val),
    NullLiteral: () => bTypes.nullLiteralTypeAnnotation(),
  };

  const anyType = () => bTypes.anyTypeAnnotation();
  const buildType = types[nodeType] || anyType;
  return buildType(value);
};

const getReturnStatements = (path: PathType): Array<PathType> => {
  const returnStatements = [];
  path.traverse({
    ReturnStatement(innerPath) {
      if (innerPath.node.argument) {
        returnStatements.push(innerPath);
      }
    },
  });

  return returnStatements;
};

const getTypeAnnotation = (returnStatements: Array<PathType>) => {
  if (returnStatements.length === 0) {
    return bTypes.typeAnnotation(bTypes.voidTypeAnnotation());
  }

  const typeAnnotations = returnStatements.map(({ node }) => {
    const { type, value } = node.argument;
    const typeAnnotation = getFlowType(type, value);
    return typeAnnotation;
  });

  if (typeAnnotations.length === 1) {
    return bTypes.typeAnnotation(typeAnnotations[0]);
  }

  const unionTypes = bTypes.UnionTypeAnnotation(typeAnnotations);
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
      const { type, value } = path.node.body;
      const returnTypeAnnotation = bTypes.typeAnnotation(getFlowType(type, value));
      path.get('returnType').replaceWith(returnTypeAnnotation);
      return;
    }

    const returnStatements = getReturnStatements(path);
    const typeAnnotation = getTypeAnnotation(returnStatements);
    path.get('returnType').replaceWith(typeAnnotation);
  },
};
