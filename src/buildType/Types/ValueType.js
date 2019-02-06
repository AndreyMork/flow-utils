// @flow

import Type from './Type';
import getAnnotationBuilder from '../getAnnotationBuilder';
import type { BabelTypesTypeAnnotationType } from '../types.flow';

type ValueArgType = string | boolean | number;
class ValueType extends Type {
  +value: ValueArgType;

  constructor(type: string, value: ValueArgType) {
    super(type);
    this.value = value;
  }

  isSubtype(b: Type): boolean {
    if (!(b instanceof ValueType)) {
      return super.isSubtype(b);
    }

    return this.type === b.type && this.value === b.value;
  }

  buildAnnotation(): BabelTypesTypeAnnotationType {
    const buildAnnotation = getAnnotationBuilder(this.type);
    return buildAnnotation(this.value);
  }
}

export default ValueType;
