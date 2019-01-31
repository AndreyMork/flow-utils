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

  constructor(annotationNode: AnnotationNodeType) {
    this.type = stripTailPart(annotationNode.type);
    this.node = annotationNode;
  }

  isSubtype(b: Type): boolean {
    // COMBAK
    if (this.type === 'ArrayTypeAnnotation') {
      return false;
    }
    if (this.type === 'TupleTypeAnnotation' && b.type === 'TupleTypeAnnotation') {
      const thisSubtypes = this.node.types.map(item => new Type(item));
      const bSubtypes = this.node.types.map(item => new Type(item));

      return thisSubtypes.every((item, ind) => item.isSubtype(bSubtypes[ind]));
    }
    if (this.type === b.type && this.node.value === b.node.value) {
      return true;
    }

    const temp = Type.typesHierarchy.findNode(b.type);
    if (!temp) {
      return false;
    }

    return temp.includes(this.type);
  }
}

export default Type;
