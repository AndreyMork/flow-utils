// @flow

import Type from './Types/Type';
import ValueType from './Types/ValueType';
import TupleType from './Types/TupleType';
import { knownTypes } from './getAnnotationBuilder';
import type { TypesType } from './types.flow';

const buildType = (typeObject: TypesType): Type => {
  const { type } = typeObject;

  if (!knownTypes.includes(type)) {
    // QUESTION: what to do?
    console.warn(`Unknown type '${type}'`);
    return new Type('Any');
  }

  if (typeObject.value != null) {
    return new ValueType(type, typeObject.value);
  }

  if (typeObject.elements != null) {
    return new TupleType(type, typeObject.elements.map(buildType));
  }

  return new Type(type);
};

export default buildType;
