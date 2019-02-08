// @flow

import BaseType from './BaseType';
import getAnnotationBuilder from '../getAnnotationBuilder';
import type { BabelTypesTypeAnnotationType } from '../types.flow';

type ElementsType = Array<BaseType>;
class TupleType extends BaseType {
  +elements: ElementsType;

  constructor(type: string, elements: ElementsType) {
    super(type);
    this.elements = elements;
  }

  isSubtype(b: BaseType): boolean {
    if (!(b instanceof TupleType)) {
      return super.isSubtype(b);
    }

    if (this.elements.length !== b.elements.length) {
      return false;
    }

    const bElements = b.elements;
    return this.elements.every((elem, ind) => elem.isSubtype(bElements[ind]));
  }

  buildAnnotation(): BabelTypesTypeAnnotationType {
    const buildAnnotation = getAnnotationBuilder(this.type);
    const elementsAnnotations = this.elements.map(el => el.buildAnnotation());

    return buildAnnotation(elementsAnnotations);
  }
}

export default TupleType;
