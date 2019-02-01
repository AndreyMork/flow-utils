// @flow

import * as babelTypes from '@babel/types';
import Type from './Type';

const builderFunctions = {
  Tuple: babelTypes.TupleTypeAnnotation,
};

const possibleTypes = Object.keys(builderFunctions);

class TupleType extends Type {
  elements: Array<Type>;

  constructor(type: string, elements: Array<Type>): void {
    if (!TupleType.canAccept(type)) {
      throw new Error(`Wrong type '${type}'`);
    }

    // if (isValueWrong(value)) {
    // // TODO: this check
    //   throw new Error(`Wrong value ${value} for type '${type}'`);
    // }

    super(type);
    this.elements = elements;
  }

  static canAccept = (type: string): boolean => possibleTypes.includes(type);

  buildAnnotation() {
    const builderFunction = builderFunctions[this.type];
    return builderFunction(this.elements.map(el => el.buildAnnotation()));
  }

  isSubtype(b: Type): boolean {
    if (b instanceof TupleType) {
      if (this.elements.length !== b.elements.length) {
        return false;
      }

      const bElement = b.elements;
      return this.elements.every((elem, ind) => elem.isSubtype(bElement[ind]));
    }

    return super.isSubtype(b);
  }
}

export default TupleType;
