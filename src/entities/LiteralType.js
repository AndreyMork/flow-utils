// @flow

import * as babelTypes from '@babel/types';
import Type from './Type';

type ValueType = string | number | boolean;
type PossibleTypes = 'StringLiteral' | 'NumericLiteral' | 'BooleanLiteral';

const builderFunctions = {
  StringLiteral: babelTypes.StringLiteralTypeAnnotation,
  NumericLiteral: babelTypes.NumberLiteralTypeAnnotation,
  BooleanLiteral: babelTypes.BooleanLiteralTypeAnnotation,
};

const possibleTypes = Object.keys(builderFunctions);

class LiteralType extends Type {
  value: ValueType;

  constructor(type: PossibleTypes, value: ValueType) {
    if (!possibleTypes.includes(type)) {
      throw new Error(`Wrong type '${type}'`);
    }
    // if (isValueWrong(value)) {
    // // TODO: this check
    //   throw new Error(`Wrong value ${value} for type '${type}'`);
    // }

    super(type);
    this.value = value;
  }

  buildAnnotation() {
    const builderFunction = builderFunctions[this.type];

    return builderFunction(this.value);
  }

  isSubtype(b: Type) {
    if (b instanceof LiteralType) {
      return this.type === b.type && this.value === b.value;
    }

    return super.isSubtype(b);
  }
}

export default LiteralType;
