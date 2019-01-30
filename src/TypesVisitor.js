// @flow

import * as bTypes from '@babel/types';
import type { PathType } from './types.flow';
import { getFlowType, resolveTypes } from './typeUtils';
import { flat } from './utils';

// const traverse = require('@babel/traverse').default;

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
    return bTypes.typeAnnotation(bTypes.VoidTypeAnnotation());
  }

  const typeAnnotations = flat(
    returnStatements.map(({ node }) => {
      if (!node.argument) {
        return bTypes.VoidTypeAnnotation();
      }

      const typeAnnotation = getFlowType(node.argument);

      return typeAnnotation;
    }),
  );

  if (typeAnnotations.length === 1) {
    return bTypes.typeAnnotation(typeAnnotations[0]);
  }

  const resolvedTypes = resolveTypes(typeAnnotations);
  const unionTypes = bTypes.UnionTypeAnnotation(resolvedTypes);
  return bTypes.typeAnnotation(unionTypes);
};

export default {
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
