// @flow

const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

module.exports.default = (code: string, cb: Function): void => {
  const ast = babelParser.parse(
    code,
    {
      sourceType: 'unambiguous',
      plugins: ['flow'],
    },
  );


  traverse(ast, {
    enter(path) {
      cb(path, code);
    },
  });
};
