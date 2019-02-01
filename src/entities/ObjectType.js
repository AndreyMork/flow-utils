// @flow

import * as babelTypes from '@babel/types';
import Type from './Type';
import type { AstNodeType } from '../types.flow';

const builderFunctions = {
  Object: babelTypes.ObjectTypeAnnotation,
};

const possibleTypes = Object.keys(builderFunctions);

type PropertiesType = Array<{| key: AstNodeType, value: Type |}>;
class ObjectType extends Type {
  properties: PropertiesType;

  constructor(type: string, properties: PropertiesType): void {
    if (!ObjectType.canAccept(type)) {
      throw new Error(`Wrong type '${type}'`);
    }

    // if (isValueWrong(value)) {
    // // TODO: this check
    //   throw new Error(`Wrong value ${value} for type '${type}'`);
    // }

    super(type);
    this.properties = [...properties].sort(prop => prop.key.name);
  }

  static canAccept = (type: string): boolean => possibleTypes.includes(type);

  buildAnnotation() {
    const builderFunction = builderFunctions[this.type];
    const mapF = ({ key, value }) => babelTypes.ObjectTypeProperty(key, value.buildAnnotation());
    const properties = this.properties.map(mapF);
    return builderFunction(properties, null, null, null, true);
  }

  isSubtype(b: Type): boolean {
    if (b instanceof ObjectType) {
      if (this.properties.length !== b.properties.length) {
        return false;
      }

      const bProperties = b.properties;
      return this.properties.every((prop, ind) => {
        const bProp = bProperties[ind];

        const thisPropName = prop.key.name;
        const bPropName = bProp.key.name;

        const thisPropValue = prop.value;
        const bPropValue = bProp.value;

        return thisPropName === bPropName && thisPropValue.isSubtype(bPropValue);
      });
    }

    return super.isSubtype(b);
  }
}

export default ObjectType;
