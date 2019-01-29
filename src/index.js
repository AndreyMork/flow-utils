require('flow-remove-types/register');

const generate = require('@babel/generator').default;
const astWalker = require('./ast').default;
const TypesVisitor = require('./TypesVisitor').default;

export default (sourceCode) => {
  const ast = astWalker(sourceCode, TypesVisitor);
  const distCode = generate(ast, { retainLines: true }).code;

  return distCode;
};
