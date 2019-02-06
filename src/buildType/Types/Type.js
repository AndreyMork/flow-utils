// @flow

import typesHierarchy from '../utils/typesHierarchy';
import getAnnotationBuilder from '../getAnnotationBuilder';

import typeof Tree from '../utils/Tree';
import type { BabelTypesTypeAnnotationType } from '../types.flow';

class Type {
  +type: string;
  constructor(type: string) {
    this.type = type;
  }

  static typesHierarchy: Tree = typesHierarchy;

  static resolveTypes(types: $ReadOnlyArray<Type>): Array<Type> {
    return types.reduce((acc: Array<Type>, type: Type): Array<Type> => {
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
  }

  isSubtype(b: Type): boolean {
    const possibleParent = typesHierarchy.findNode(b.type);
    if (possibleParent == null) {
      return false;
    }

    return possibleParent.includes(this.type);
  }

  buildAnnotation(): BabelTypesTypeAnnotationType {
    const buildAnnotation = getAnnotationBuilder(this.type);
    return buildAnnotation();
  }
}

export default Type;
