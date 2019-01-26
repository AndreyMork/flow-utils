// @flow

import type { PathType } from './types';

const traverse = require('@babel/traverse').default;
const bTypes = require('@babel/types');
const { printCodeSeg } = require('./utils');


const getFlowType = (nodeType: string) => {
  const types = {
    StringLiteral: value => bTypes.StringLiteralTypeAnnotation(value),
    TemplateLiteral: () => bTypes.StringTypeAnnotation(),
    NumericLiteral: value => bTypes.NumberLiteralTypeAnnotation(value),
    BooleanLiteral: value => bTypes.BooleanLiteralTypeAnnotation(value),
    NullLiteral: () => bTypes.nullLiteralTypeAnnotation(),
  };

  const anyType = () => bTypes.anyTypeAnnotation();
  return types[nodeType] || anyType;
};


module.exports.default = () => ({
  ReturnStatement(path: PathType) {
    const { type, value } = path.node.argument;

    const parentFunction = path.getFunctionParent();
    const { returnType } = parentFunction.node;
    const newTypeAnnotation = getFlowType(type)(value);

    if (returnType) {
      const { typeAnnotation } = returnType;
      if (bTypes.isUnionTypeAnnotation(typeAnnotation)) {
        typeAnnotation.types.push(newTypeAnnotation);
      } else {
        // console.log(typeAnnotation);
        const unionTypes = bTypes.UnionTypeAnnotation([
          typeAnnotation, newTypeAnnotation,
        ]);
        parentFunction.node.returnType = bTypes.typeAnnotation(unionTypes);
      }
    } else {
      parentFunction.node.returnType = bTypes.typeAnnotation(newTypeAnnotation);
    }
  },
  ArrowFunctionExpression(path: PathType) {
    if (!bTypes.isBlockStatement(path.node.body)) {
      const { type, value } = path.node.body;
      const typeAnnotation = bTypes.typeAnnotation(getFlowType(type)(value));
      path.node.returnType = typeAnnotation;
    }
  },
});
