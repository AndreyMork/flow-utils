// @flow

import * as babelTypes from '@babel/types';
import Type from './Type';

const builderFunctions = {
  StringLiteral: babelTypes.StringLiteralTypeAnnotation,
  NumericLiteral: babelTypes.NumberLiteralTypeAnnotation,
  BooleanLiteral: babelTypes.BooleanLiteralTypeAnnotation,
};

const possibleTypes = Object.keys(builderFunctions);

type ValueArgType = string | boolean | number;

class ValueType extends Type {
  value: ValueArgType;

  constructor(type: string, value: ValueArgType): void {
    if (!ValueType.canAccept(type)) {
      throw new Error(`Wrong type '${type}'`);
    }

    // if (isValueWrong(value)) {
    // // TODO: this check
    //   throw new Error(`Wrong value ${value} for type '${type}'`);
    // }

    super(type);
    this.value = value;
  }

  static canAccept = (type: string): boolean => possibleTypes.includes(type);

  buildAnnotation() {
    const builderFunction = builderFunctions[this.type];
    return builderFunction(this.value);
  }

  isSubtype(b: Type): boolean {
    if (b instanceof ValueType) {
      return this.type === b.type && this.value === b.value;
    }

    return super.isSubtype(b);
  }
}

export default ValueType;
