// @flow

import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import type { VisitorType } from './types.flow';

export default (code: string, visitor: VisitorType): void => {
  const ast = parse(code, {
    sourceType: 'unambiguous',
    plugins: ['flow'],
  });

  traverse(ast, visitor);
  return ast;
};
