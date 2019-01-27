require('flow-remove-types/register');

const { default: generate } = require('@babel/generator');
const fs = require('fs');
const { default: astWalker } = require('./ast');
// const { default: typeWarnings } = require('./typeWarnings.js');
// const { default: primitiveTypes } = require('./primitiveTypes');
const ImportVisitor = require('./ImportVisitor').default;
const ExportVisitor = require('./ExportVisitor').default;


// const pathToSource = `${__dirname}/test.js`;
const pathToSource = `${__dirname}/assets/source.js`;
const pathToDist = `${__dirname}/assets/dist.js`;

const scriptContent = fs.readFileSync(pathToSource, 'utf-8');
const ast = astWalker(scriptContent, { ...ImportVisitor, ...ExportVisitor });
const { code } = generate(ast, {
  retainLines: true,
  // retainFunctionParens: true,
});
// console.log(code);
// eval(code);
fs.writeFileSync(pathToDist, code);
