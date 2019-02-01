// @flow

import * as bTypes from '@babel/types';
import type { PathType } from './types.flow';
import Type from './entities/Type';
import returnStatementToType from './typeUtils';
// import { flat } from './utils';

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

  const types = returnStatements.map(({ argument }) => returnStatementToType(argument));
  if (types.length === 1) {
    return bTypes.typeAnnotation(types[0].buildAnnotation());
  }

  const resolvedTypes = Type.resolveTypes(types);
  const annotations = resolvedTypes.map(type => type.buildAnnotation());
  const unionTypes = bTypes.UnionTypeAnnotation(annotations);
  return bTypes.typeAnnotation(unionTypes);
};

export default {
  'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression': (path: PathType) => {
    if (!path.get('body').isBlockStatement()) {
      const { body } = path.node;
      const returnTypeAnnotation = bTypes.typeAnnotation(
        returnStatementToType(body).buildAnnotation(),
      );
      path.get('returnType').replaceWith(returnTypeAnnotation);
      return;
    }

    const returnStatements = getReturnStatements(path);
    const typeAnnotation = getTypeAnnotation(returnStatements);
    path.get('returnType').replaceWith(typeAnnotation);
  },
};
