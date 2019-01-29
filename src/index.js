require('flow-remove-types/register');

const { default: generate } = require('@babel/generator');
const fs = require('fs');
const { default: astWalker } = require('./ast');
// const { default: typeWarnings } = require('./typeWarnings.js');
const TypesVisitor = require('./TypesVisitor').default;

// const pathToSource = `${__dirname}/test.js`;
const pathToSource = `${__dirname}/../assets/source.js`;
const pathToDist = `${__dirname}/../assets/dist.js`;

const scriptContent = fs.readFileSync(pathToSource, 'utf-8');
const ast = astWalker(scriptContent, TypesVisitor);
const { code } = generate(ast, {
  retainLines: true,
  // retainFunctionParens: true,
});

fs.writeFileSync(pathToDist, code);
