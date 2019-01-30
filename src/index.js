import generate from '@babel/generator';
import astWalker from './ast';
import TypesVisitor from './TypesVisitor';

export default (sourceCode) => {
  const ast = astWalker(sourceCode, TypesVisitor);
  const distCode = generate(ast, { retainLines: true }).code;

  return distCode;
};
