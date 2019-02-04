// @flow

import * as babelTypes from '@babel/types';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Tree from './Tree';

const pathToTypesHierarchy = path.join(__dirname, '../../assets/types-hierarchy.yaml');
const typesHierarchyObject = yaml.safeLoad(fs.readFileSync(pathToTypesHierarchy));

class Type {
  typesHierarchy: Tree;
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  static typesHierarchy = new Tree(typesHierarchyObject);

  static resolveTypes(types: Array<Type>): Array<Type> {
    const res = types.reduce((acc: Array<Type>, type: Type): Array<Type> => {
      const typeIsAbundant = acc.some(
        (possibleSuperior: Type): boolean => type.isSubtype(possibleSuperior),
      );

      if (typeIsAbundant) {
        return acc;
      }

      const filteredAcc = acc.filter(
        (possibleSubtype: Type): boolean => !possibleSubtype.isSubtype(type),
      );

      return [...filteredAcc, type];
    }, []);

    return res;
  }

  static compare(a: Type, b: Type): number {
    // a < b => less than 0
    // a == b => equals 0
    // a > b => greater than 0
    const aLevel = Type.typesHierarchy.getNodeLevel(a.type);
    if (!aLevel) {
      throw new Error(`Unknown type ${a.type}`);
    }

    const bLevel = Type.typesHierarchy.getNodeLevel(b.type);
    if (!bLevel) {
      throw new Error(`Unknown type ${b.type}`);
    }

    return bLevel - aLevel;
  }

  buildAnnotation() {
    const builderFunctions = {
      TemplateLiteral: babelTypes.StringTypeAnnotation,
      NullLiteral: babelTypes.NullLiteralTypeAnnotation,
      Void: babelTypes.VoidTypeAnnotation,
      String: babelTypes.StringTypeAnnotation,
      Number: babelTypes.NumberTypeAnnotation,
      Boolean: babelTypes.BooleanTypeAnnotation,
      Any: babelTypes.AnyTypeAnnotation,
    };

    const builderFunction = builderFunctions[this.type];
    if (!builderFunction) {
      return builderFunctions.Any();
    }

    return builderFunction();
  }

  isSubtype(b: Type): boolean {
    if (this.type === b.type) {
      return true;
    }

    const possibleParent = Type.typesHierarchy.findNode(b.type);
    if (!possibleParent) {
      return false;
    }

    return possibleParent.includes(this.type);
  }
}

export default Type;
