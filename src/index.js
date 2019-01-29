require('flow-remove-types/register');

const generate = require('@babel/generator').default;
const astWalker = require('./ast').default;
const TypesVisitor = require('./TypesVisitor').default;

module.exports.default = (sourceCode) => {
  const ast = astWalker(sourceCode, TypesVisitor);
  const distCode = generate(ast, { retainLines: true }).code;

  return distCode;
};
