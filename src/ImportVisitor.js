const template = require('@babel/template').default;
const bTypes = require('@babel/types');


const buildNamedRequire = template(`
  const { NAMED_IMPORTS } = require(SOURCE);
`);
const buildDeclarationlessRequire = template(`
  require(SOURCE);
`);

const convertImportNodeToObjectKeys = (node) => {
  const { name } = node.local;
  if (bTypes.isImportDefaultSpecifier(node)) {
    return `default: ${name}`;
  }

  if (bTypes.isImportNamespaceSpecifier(node)) {
    return `...${name}`;
  }

  const importedName = node.imported.name;
  if (importedName !== name) {
    return `${importedName}: ${name}`;
  }

  return name;
};

const ImportVisitor = {
  ImportDeclaration(path) {
    const { specifiers, source } = path.node;

    if (specifiers.length === 0) {
      const requireNode = buildDeclarationlessRequire({ SOURCE: source });
      path.replaceWith(requireNode);
      return;
    }

    // const onlyDefault = specifiers.length === 1
    //   && path.get('specifiers.0').isImportDefaultSpecifier();
    // if (onlyDefault) {
    //   const requireNode = buildDefaultRequire({
    //     IMPORT_NAME: path.get('specifiers.0').node.local,
    //     SOURCE: source,
    //   });
    //   path.replaceWith(requireNode);
    //   return;
    // }

    const namedImports = specifiers
      .map(convertImportNodeToObjectKeys)
      .join(', ');

    const requireNode = buildNamedRequire({
      NAMED_IMPORTS: namedImports,
      SOURCE: source,
    });
    path.replaceWith(requireNode);
  },
};

module.exports.default = ImportVisitor;
