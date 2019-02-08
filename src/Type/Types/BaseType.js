// @flow

import typesHierarchy from '../utils/typesHierarchy';
import getAnnotationBuilder from '../getAnnotationBuilder';

import typeof Tree from '../utils/Tree';
import type { BabelTypesTypeAnnotationType } from '../types.flow';

class BaseType {
  +type: string;
  constructor(type: string) {
    this.type = type;
  }

  static typesHierarchy: Tree = typesHierarchy;

  isSubtype(b: BaseType): boolean {
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

export default BaseType;
