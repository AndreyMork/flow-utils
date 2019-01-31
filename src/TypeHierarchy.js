// @flow

import Tree from './Tree';
import typesHierarchyJSON from '../assets/types-hierarchy.json';

type AnnotationNodeType = Object;

const stripTailPart = (annotation: string): string => {
  const tailPart = 'TypeAnnotation';

  const [res] = annotation.split(tailPart);
  return res;
};

class Type {
  typesHierarchy: Tree;

  type: string;

  node: AnnotationNodeType;

  static typesHierarchy = new Tree(typesHierarchyJSON);

  constructor(annotationNode: AnnotationNodeType) {
    this.type = stripTailPart(annotationNode.type);
    this.node = annotationNode;
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

  isSubtype(t: Type) {}
}

export default Type;
