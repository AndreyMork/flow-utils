// @flow

import * as bTypes from '@babel/types';
import Tree from './Tree';
import typesHierarchyJSON from '../../assets/types-hierarchy.json';

class Type {
  typesHierarchy: Tree;
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  static typesHierarchy = new Tree(typesHierarchyJSON);

  static resolveTypes(types: Array<Type>): Array<Type> {
    const sortedTypes = [...types].sort(Type.compare);
    const res = sortedTypes.filter((item, ind) => {
      const leftTypes = sortedTypes.slice(ind + 1);
      return !leftTypes.some(possibleSuperior => item.isSubtype(possibleSuperior));
    });

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
      TemplateLiteral: bTypes.StringTypeAnnotation,
      NullLiteral: bTypes.NullLiteralTypeAnnotation,
      Void: bTypes.VoidTypeAnnotation,
      String: bTypes.StringTypeAnnotation,
      Number: bTypes.NumberTypeAnnotation,
      Boolean: bTypes.BooleanTypeAnnotation,
      Any: bTypes.AnyTypeAnnotation,
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
