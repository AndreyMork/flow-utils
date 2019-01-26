require('flow-remove-types/register');

const generate = require('@babel/generator').default;
const fs = require('fs');
const astWalker = require('./ast').default;
// const typeWarnings = require('./typeWarnings.js').default;
const primitiveTypes = require('./primitiveTypes').default;


const pathToSource = `${__dirname}/assets/source.js`;
const pathToDist = `${__dirname}/assets/dist.js`;

const scriptContent = fs.readFileSync(pathToSource, 'utf-8');
const ast = astWalker(scriptContent, primitiveTypes);
const { code } = generate(ast);
fs.writeFileSync(pathToDist, code);
