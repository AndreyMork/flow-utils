const template = require('@babel/template').default;
const bTypes = require('@babel/types');

const moduleExportsDefault = (rVal) => {
  const assignemntTemplate = template.ast('module.exports.default = rVal');

  assignemntTemplate.expression.right = rVal;
  return assignemntTemplate;
};

const moduleExportsNamed = (rVal) => {
  const { name } = rVal.id;
  const assignemntTemplate = template.ast(`module.exports.${name} = ${name}`);

  return assignemntTemplate;
};


const ExportVisitor = {
  ExportNamedDeclaration(path) {
    const { declaration } = path.node;
    path.replaceWith(declaration);
    const { declarations } = declaration;
    if (declarations) {
      path.insertAfter(moduleExportsNamed(declarations[0]));
    }
  },
  ExportDefaultDeclaration(path) {
    const { declaration } = path.node;
    path.replaceWith(moduleExportsDefault(declaration));
  },
};

module.exports.default = ExportVisitor;
