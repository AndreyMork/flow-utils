// @flow

import babelTypes from '@babel/types';
import Type from './Type';
import getAnnotationBuilder from '../getAnnotationBuilder';
import type { BabelTypesTypeAnnotationType } from '../types.flow';

type PropertiesType = $ReadOnlyArray<{| key: string, value: Type |}>;
class ObjectType extends Type {
  properties: PropertiesType;

  constructor(type: string, properties: PropertiesType) {
    super(type);
    this.properties = [...properties].sort((a, b) => (a.key < b.key ? -1 : 1));
  }

  buildAnnotation(): BabelTypesTypeAnnotationType {
    const buildAnnotation = getAnnotationBuilder(this.type);

    const properties = this.properties.map(
      (prop): * => {
        const key = babelTypes.StringLiteral(prop.key);
        const value = prop.value.buildAnnotation();

        return babelTypes.ObjectTypeProperty(key, value);
      },
    );

    return buildAnnotation(properties);
  }

  isSubtype(b: Type): boolean {
    if (!(b instanceof ObjectType)) {
      return super.isSubtype(b);
    }

    if (this.properties.length !== b.properties.length) {
      return false;
    }

    const bProperties = b.properties;
    return this.properties.every(
      (prop, ind): boolean => {
        const bProp = bProperties[ind];

        const thisPropName = prop.key;
        const bPropName = bProp.key;

        const thisPropValue = prop.value;
        const bPropValue = bProp.value;

        return thisPropName === bPropName && thisPropValue.isSubtype(bPropValue);
      },
    );
  }
}
export default ObjectType;
