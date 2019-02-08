// @flow

import BaseType from './BaseType';
import getAnnotationBuilder from '../getAnnotationBuilder';
import type { BabelTypesTypeAnnotationType } from '../../flow-types/Type.flow';

type ValueArgType = string | boolean | number;
class ValueType extends BaseType {
  +value: ValueArgType;

  constructor(type: string, value: ValueArgType) {
    super(type);
    this.value = value;
  }

  isSubtype(b: BaseType): boolean {
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
