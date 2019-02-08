// @flow

import BaseType from './Types/BaseType';
import ValueType from './Types/ValueType';
import TupleType from './Types/TupleType';
import { knownTypes } from './getAnnotationBuilder';
import type { TypesType, BabelTypesTypeAnnotationType } from './types.flow';

const buildType = (typeObject: TypesType): BaseType => {
  const { type } = typeObject;

  if (!knownTypes.includes(type)) {
    // QUESTION: what to do?
    console.warn(`Unknown type '${type}'`);
    return new BaseType('Any');
  }

  if (typeObject.value != null) {
    return new ValueType(type, typeObject.value);
  }

  if (typeObject.elements != null) {
    return new TupleType(type, typeObject.elements.map(buildType));
  }

  return new BaseType(type);
};

class Type {
  instance: BaseType;

  constructor(typeObject: TypesType) {
    this.instance = buildType(typeObject);
  }

  static resolveTypes(types: $ReadOnlyArray<Type>): Array<Type> {
    return types.reduce((acc: Array<Type>, type: Type): Array<Type> => {
      const typeIsAbundant = acc.some(
        (possibleSuperior: Type): boolean => type.isSubtype(possibleSuperior),
      );

      if (typeIsAbundant) {
        return acc;
      }

      const filteredAcc = acc.filter(
        (possibleSubtype: Type): boolean => !possibleSubtype.isSubtype(type),
      );

      return [...filteredAcc, type];
    }, []);
  }

  isSubtype(b: Type): boolean {
    return this.isSubtype(b);
  }

  buildAnnotation(): BabelTypesTypeAnnotationType {
    return this.buildAnnotation();
  }
}

export default Type;
