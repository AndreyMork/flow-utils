// @flow

import babelTypes from '@babel/types';
import BaseType from './BaseType';
import getAnnotationBuilder from '../getAnnotationBuilder';
import type { BabelTypesTypeAnnotationType } from '../types.flow';

type PropertiesType = $ReadOnlyArray<{| key: string, value: BaseType |}>;
class ObjectType extends BaseType {
  +properties: PropertiesType;

  constructor(type: string, properties: PropertiesType) {
    super(type);
    this.properties = [...properties].sort((a, b) => (a.key < b.key ? -1 : 1));
  }

  buildAnnotation(): BabelTypesTypeAnnotationType {
    const buildAnnotation = getAnnotationBuilder(this.type);

    // TODO: separate this function
    const properties = this.properties.map(
      (prop): * => {
        const key = babelTypes.StringLiteral(prop.key);
        const value = prop.value.buildAnnotation();

        return babelTypes.ObjectTypeProperty(key, value);
      },
    );

    return buildAnnotation(properties);
  }

  isSubtype(b: BaseType): boolean {
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
