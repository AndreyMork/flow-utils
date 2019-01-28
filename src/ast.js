// @flow

import type { VisitorType } from './types.flow';

const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

module.exports.default = (code: string, visitor: VisitorType): void => {
  const ast = babelParser.parse(
    code,
    {
      sourceType: 'unambiguous',
      plugins: ['flow'],
    },
  );

  traverse(ast, visitor);
  return ast;
};
