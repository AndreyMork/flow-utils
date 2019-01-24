require('flow-remove-types/register');

const fs = require('fs');
const superRegister = require('./index').default;
const typeWarnings = require('./typeWarnings.js').default;


const pathToScript = `${__dirname}/temp.js`;
const scriptContent = fs.readFileSync(pathToScript, 'utf-8');
superRegister(scriptContent, typeWarnings);
