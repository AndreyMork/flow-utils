// @flow

import * as babelTypes from '@babel/types';
import type { PathType, AstNodeType } from './types.flow';
import Type from './entities/Type';
import buildType from './buildType';
// import { flat } from './utils';

// const traverse = require('@babel/traverse').default;

const getReturnStatements = (path: PathType): Array<PathType> => {
  const returnStatements = [];

  const statementsAmount = path.node.body.body.length;
  const lastStatement = path.node.body.body[statementsAmount - 1];
  // COMBAK
  if (statementsAmount === 0 || !babelTypes.isReturnStatement(lastStatement)) {
    const undefinedReturn = babelTypes.ReturnStatement();
    returnStatements.push(undefinedReturn);
  }

  path.traverse({
    ReturnStatement(innerPath) {
      returnStatements.push(innerPath.node);
    },
  });

  return returnStatements;
};

const getTypeAnnotation = (returnStatements: Array<PathType>) => {
  if (returnStatements.length === 0) {
    return babelTypes.typeAnnotation(babelTypes.VoidTypeAnnotation());
  }

  const types = returnStatements.map(
    (node: AstNodeType): Type => {
      const { argument } = node;
      return buildType(argument);
    },
  );
  if (types.length === 1) {
    return babelTypes.typeAnnotation(types[0].buildAnnotation());
  }

  const resolvedTypes = Type.resolveTypes(types);
  const annotations = resolvedTypes.map(type => type.buildAnnotation());
  const unionTypes = babelTypes.UnionTypeAnnotation(annotations);
  return babelTypes.typeAnnotation(unionTypes);
};

export default {
  'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression': (path: PathType) => {
    if (!path.get('body').isBlockStatement()) {
      const { body } = path.node;
      const returnTypeAnnotation = babelTypes.typeAnnotation(buildType(body).buildAnnotation());
      path.get('returnType').replaceWith(returnTypeAnnotation);
      return;
    }

    const returnStatements = getReturnStatements(path);
    const typeAnnotation = getTypeAnnotation(returnStatements);
    path.get('returnType').replaceWith(typeAnnotation);
  },
};
